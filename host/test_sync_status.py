"""Behaviour tests for the sync report.

Run from the host directory:

    python -I -m unittest test_sync_status
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import sync_status


class TypeSummaryTest(unittest.TestCase):
    def test_latest_success_per_type_ignores_requests_without_a_response(self):
        events = [
            {'logTime': '1103/010000', 'action': 'Commit Request',
             'context': 'Contributing types: Bookmarks, History}'},
            {'logTime': '1103/010001', 'action': 'Commit Response', 'result': 'Success'},
            # A later request that never got a response must not count.
            {'logTime': '1103/020000', 'action': 'Commit Request',
             'context': 'Contributing types: Passwords'},
        ]

        summary = sync_status.type_summary(events)

        self.assertEqual([row['type'] for row in summary], ['Bookmarks', 'History'])
        self.assertTrue(all(row['result'] == 'Success' for row in summary))
        self.assertTrue(all(row['time'] for row in summary))


class DeviceMergeTest(unittest.TestCase):
    def test_same_name_and_version_collapse_to_the_newest_sighting(self):
        devices = [
            {'name': 'DESKTOP-A', 'os': 'Windows', 'version': '1.0', 'lastSeen': '2026-11-01 09:00', 'stale': False},
            {'name': 'DESKTOP-A', 'os': 'Windows', 'version': '1.0', 'lastSeen': '2026-11-03 09:00', 'stale': False},
            {'name': 'DESKTOP-A', 'os': 'Windows', 'version': '0.9', 'lastSeen': '2026-10-01 09:00', 'stale': True},
        ]

        merged = sync_status.merge_devices(devices)

        self.assertEqual(len(merged), 2)
        current = next(row for row in merged if row['version'] == '1.0')
        self.assertEqual(current['lastSeen'], '2026-11-03 09:00')
        self.assertEqual(current['registrations'], 2)


if __name__ == '__main__':
    unittest.main()
