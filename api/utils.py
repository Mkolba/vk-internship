# -*- coding: utf-8 -*-
from datetime import datetime
from typing import Optional, List
import string
import random
import json


class BetterDict(dict):
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__

    @staticmethod
    def loads(obj):
        return json.loads(obj, object_pairs_hook=lambda x: BetterDict(x))


def convert_to_optional(schema):
    return {k: Optional[v] for k, v in schema.__annotations__.items()}
