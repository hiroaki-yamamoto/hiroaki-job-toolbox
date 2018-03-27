#!/usr/bin/env python
# -*- coding: utf-8 -*-

from unittest import TestCase
from .add import add


class AddTest(TestCase):

    def test_func(self):
        self.assertEqual(add(1, 1), 2)
