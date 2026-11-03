"""Read Edge's sync diagnostics from disk and report them as JSON.

Two sources, both under %LOCALAPPDATA%\\Microsoft\\Edge\\User Data:

- Sync Data/Logs/cv_debug.log records every exchange with the sync server.
  It is the only place that shows whether an upload actually succeeded.
- Sync Data/LevelDB holds one record per device that ever joined the account,
  with the device name, platform, client version and last update time.

Run it directly to print the report, or let the native messaging host import
`collect()`.
"""

import datetime
import glob
import json
import os
import re
import sys

EPOCH = datetime.datetime(1601, 1, 1, tzinfo=datetime.timezone.utc)

# A device that has not checked in for this long is reported as stale.
STALE_DAYS = 14

# How many recent server exchanges to surface in the report.
RECENT_EVENTS = 12

OS_NAMES = {
    'WIN': 'Windows',
    'IOS-PHONE': 'iPhone',
    'IOS-TABLET': 'iPad',
    'ANDROID': 'Android',
    'MAC': 'macOS',
}


def user_data_dir():
    return os.path.join(os.environ['LOCALAPPDATA'], r'Microsoft\Edge\User Data')


def chrome_time(micros):
    moment = EPOCH + datetime.timedelta(microseconds=int(micros))
    return moment.astimezone().strftime('%Y-%m-%d %H:%M')


def log_time(stamp):
    """cv_debug.log stamps look like 1102/064613: month, day, then hour, minute
    and second, all in UTC."""
    match = re.match(r'(\d{2})(\d{2})/(\d{2})(\d{2})(\d{2})', stamp or '')
    if not match:
        return stamp
    month, day, hour, minute, second = (int(g) for g in match.groups())
    year = datetime.date.today().year
    moment = datetime.datetime(year, month, day, hour, minute, second, tzinfo=datetime.timezone.utc)
    return moment.astimezone().strftime('%Y-%m-%d %H:%M:%S')


def read_leveldb(directory):
    blob = b''
    for path in glob.glob(os.path.join(directory, '*')):
        name = os.path.basename(path)
        if name in ('CURRENT', 'LOCK', 'LOG', 'LOG.old') or name.startswith('MANIFEST'):
            continue
        try:
            blob += open(path, 'rb').read()
        except OSError:
            continue
    return blob


def parse_devices(blob):
    """Each device is stored under device_info-dt-<cache id>. The name, client
    version and lastTimeUpdated follow within a few kilobytes."""
    devices = {}
    for match in re.finditer(rb'device_info-dt-([A-Za-z0-9+/]{22}==)', blob):
        cache = match.group(1).decode()
        window = blob[match.start():match.start() + 6000]
        name = re.search(rb'(DESKTOP-\w+|iPhone|iPad)', window)
        client = re.search(
            rb'Chrome (WIN|IOS-PHONE|IOS-TABLET|ANDROID|MAC) (\d+\.\d+\.\d+\.\d+)', window)
        stamp = re.search(rb'lastTimeUpdated.{1,6}(13\d{15})', window)

        record = devices.setdefault(cache, {
            'name': '', 'os': '', 'version': '', 'newest': None})
        if name and not record['name']:
            record['name'] = name.group(0).decode()
        if client and not record['os']:
            record['os'] = client.group(1).decode()
            record['version'] = client.group(2).decode()
        if stamp and (record['newest'] is None or stamp.group(1) > record['newest']):
            record['newest'] = stamp.group(1)
    return devices


def merge_devices(rows):
    """Edge keeps a separate record every time a device re-registers, so one
    computer shows up many times. Collapse records that name the same device
    running the same version, keeping the most recent sighting."""
    merged = {}
    for row in rows:
        key = (row['name'], row['os'], row['version'])
        current = merged.get(key)
        if current is None:
            merged[key] = dict(row, registrations=1)
            continue
        current['registrations'] += 1
        if (row['lastSeen'] or '') > (current['lastSeen'] or ''):
            current['lastSeen'] = row['lastSeen']
            current['stale'] = row['stale']
    return sorted(merged.values(), key=lambda row: row['lastSeen'] or '', reverse=True)


def device_report(devices, now):
    stale_after = now - datetime.timedelta(days=STALE_DAYS)
    rows = []
    for cache, record in devices.items():
        if not record['name']:
            continue
        last_seen = chrome_time(record['newest']) if record['newest'] else None
        stale = False
        if record['newest']:
            moment = EPOCH + datetime.timedelta(microseconds=int(record['newest']))
            stale = moment < stale_after
        rows.append({
            'cacheId': cache,
            'name': record['name'],
            'os': OS_NAMES.get(record['os'], record['os']),
            'version': record['version'],
            'lastSeen': last_seen,
            'stale': stale,
        })
    rows.sort(key=lambda row: row['lastSeen'] or '', reverse=True)
    return rows


def parse_entry(text):
    """Pull the few fields the report needs out of one log entry."""
    def field(name):
        found = re.search(r'"%s"\s*:\s*"([^"]*)"' % name, text)
        return found.group(1) if found else ''

    context = ''
    marker = re.search(r'"context"\s*:\s*', text)
    if marker:
        raw = text[marker.end():].strip().rstrip('}').strip()
        if raw.startswith('{'):
            try:
                context = json.loads(raw)
            except json.JSONDecodeError:
                context = raw.strip('"')
        else:
            context = raw.strip('"')
    return {'logTime': field('logTime'), 'action': field('action'),
            'result': field('result'), 'context': context}


def parse_log(path):
    """The log is a sequence of JSON values, some of them split over lines."""
    if not os.path.exists(path):
        return []
    try:
        text = open(path, encoding='utf-8', errors='replace').read()
    except OSError:
        return []
    # One entry starts at each {"logTime". The context value is not always
    # quoted, so the text is not valid JSON and has to be split by brace
    # depth, ignoring braces that sit inside strings.
    events = []
    for match in re.finditer(r'\{"logTime"', text):
        start = match.start()
        depth = 0
        in_string = False
        escaped = False
        end = None
        for index in range(start, len(text)):
            char = text[index]
            if in_string:
                if escaped:
                    escaped = False
                elif char == '\\':
                    escaped = True
                elif char == '"':
                    in_string = False
                continue
            if char == '"':
                in_string = True
            elif char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    end = index + 1
                    break
        if end is None:
            continue
        events.append(parse_entry(text[start:end]))
    return [event for event in events if event]


def summarize_event(event):
    action = event.get('action', '')
    result = event.get('result', '')
    context = event.get('context', '')
    detail = ''
    if isinstance(context, dict):
        if 'dataType' in context:
            detail = context['dataType']
            if 'process_success' in context:
                detail += f" {context['process_success']} 条"
        elif 'server' in context:
            detail = context.get('environment', '').split('_')[1] if '_' in context.get('environment', '') else ''
    elif isinstance(context, str):
        types = re.search(r'Contributing types: ([^}\n]+)', context)
        count = re.search(r'Item count: (\d+)', context)
        if types:
            detail = types.group(1).strip()
            if count:
                detail += f"，{count.group(1)} 条"
        elif 'Received' in context:
            detail = re.search(r'Received \d+ update\(s\)', context).group(0) if re.search(r'Received \d+ update\(s\)', context) else ''
        elif context.startswith('Result:'):
            detail = context.split('.', 1)[0].replace('Result: ', '')
    return {
        'time': log_time(event.get('logTime', '')),
        'action': action,
        'result': result,
        'detail': detail,
    }


def request_types(event):
    """The data types named in a commit request's context."""
    context = event.get('context', '')
    if isinstance(context, dict):
        context = json.dumps(context)
    found = re.search(r'Contributing types: ([^}\n]+)', context)
    if not found:
        return []
    return [name.strip() for name in found.group(1).split(',') if name.strip()]


def type_summary(events):
    """The newest confirmed upload of each data type.

    A commit request lists the types it carries. Those types only count once the
    matching Commit Response comes back Success; a request that never got a
    response contributed nothing, because nothing confirms it landed. Some
    builds also log each accepted type as Commit.<type>, which counts the same
    way.
    """
    latest = {}
    pending = []
    for event in events:
        action = event.get('action', '')
        if action == 'Commit Request':
            pending = request_types(event)
        elif action == 'Commit Response':
            if event.get('result') == 'Success':
                for data_type in pending:
                    latest[data_type] = event.get('logTime', '')
            pending = []
        elif action.startswith('Commit.') and event.get('result') == 'Success':
            latest[action.split('.', 1)[1]] = event.get('logTime', '')
    rows = [{'type': data_type, 'time': log_time(stamp), 'result': 'Success'}
            for data_type, stamp in latest.items()]
    rows.sort(key=lambda row: row['time'] or '', reverse=True)
    return rows


def sync_verdict(events):
    """Judge the sync from the most recent exchanges.

    Healthy means a commit was accepted. Stuck means the server keeps treating
    this browser as a brand new client and only the encryption key comes back,
    which is the failure seen when the device registration has gone bad.
    """
    commits = [e for e in events if e.get('action') == 'Commit Response']
    if commits and commits[-1].get('result') == 'Success':
        return 'ok', '同步正常，最近一次上传已被服务器接受'

    responses = [e for e in events if e.get('action') == 'GetUpdates Response']
    new_client = [e for e in events if e.get('action') == 'Initial GetUpdates'
                  and 'NEW_CLIENT' in json.dumps(e.get('context', ''))]
    if new_client and not commits:
        return 'stuck', '同步卡住了：服务器一直把这台电脑当成新设备，没有进入正常同步'

    if responses:
        return 'idle', '有过同步记录，但最近没有上传'
    return 'unknown', '没有找到同步记录'


def collect(profile='Default'):
    root = os.path.join(user_data_dir(), profile)
    now = datetime.datetime.now(datetime.timezone.utc)

    devices = merge_devices(device_report(
        parse_devices(read_leveldb(os.path.join(root, 'Sync Data', 'LevelDB'))), now))
    events = parse_log(os.path.join(root, 'Sync Data', 'Logs', 'cv_debug.log'))
    status, summary = sync_verdict(events)

    last_success = next((e.get('logTime') for e in reversed(events)
                         if e.get('action') == 'Commit Response' and e.get('result') == 'Success'), None)

    return {
        'profile': profile,
        'generatedAt': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'status': status,
        'summary': summary,
        'lastUpload': log_time(last_success) if last_success else None,
        'devices': devices,
        'types': type_summary(events),
        'recentEvents': [summarize_event(e) for e in events[-RECENT_EVENTS:]],
    }


if __name__ == '__main__':
    json.dump(collect(), sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write('\n')
