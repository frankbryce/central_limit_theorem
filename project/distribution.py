from __future__ import annotations

from enum import Enum
import numpy as np
from tqdm import tqdm

def flip_coin(p: float) -> int:
    class CoinFlip(Enum):
        HEADS = 0
        TAILS = 1
    def get():
        if np.random.random() < p:
            return CoinFlip.HEADS.value
        return CoinFlip.TAILS.value

    return get

def run(gets, n: int) -> int:
    s = 0
    for _ in range(n):
        for get in gets:
            s += get()
    return s

def make(gets, ndists: int, ngets: int) -> list[int]:
    sums = list()
    for _ in tqdm(range(ndists), desc="Generating Distribution"):
        sums.append(run(gets, ngets))
    return sums


