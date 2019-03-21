## Overview

|                  |Atom    | Molecule | Beaker   |
|------------------|--------|----------|----------|
|is_first          |O       |O         |O         |
|user_id           |C       |C         |C         |
|id                |C       |C         |C         |
|created           |C       |C         |C         |
|started           |S       |X         |X         |
|finished          |S       |X         |X         |
|paused            |S       |X         |X         |
|category          |S       |S         |S         |
|running           |O       |X         |X         |
|done              |S       |CT        |CT        |
|fresh_rate        |C       |CT        |CT        |
|done_percentage   |X       |CT        |CT        |
|done_counts       |S(0-1)  |CT        |CT        |
|elapsed           |C       |C         |C         |
|left              |X       |C         |C         |
|buffer            |X       |C         |C         |
|difficulty        |S(0-10) |CT(0-10)  |CT(0-10)  |
|level             |C(1-6)  |C(1-6)    |C(1-6)    |

- S := set
- X := none
- C := caluculate
- T := Total 

- (num) := range

## Calcs
### signed_deviation

