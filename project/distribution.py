from __future__ import annotations

from enum import Enum
import numpy as np
from tqdm import tqdm

def flip_coin(p: float) -> int:
    class CoinFlip(Enum):
        HEADS = 1
        TAILS = 2
    def get():
        if np.random.random() < p:
            return CoinFlip.HEADS.value
        return CoinFlip.TAILS.value

    return get

def run(get, n: int) -> int:
    s = 0
    for _ in range(n):
        s += get()
    return s

def make(get, ndists: int, ngets: int) -> list[int]:
    sums = list()
    for _ in tqdm(range(ndists), desc="Generating Distribution"):
        sums.append(run(get, ngets))
    return sums


