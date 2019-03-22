## Overview

|                  |Atom    | Molecule | Beaker   |
|------------------|--------|----------|----------|
|is_first          |C       |C         |C         |
|user_id           |C       |C         |C         |
|id                |C       |C         |C         |
|created           |C       |C         |C         |
|started           |S       |N         |N         |
|finished          |S       |N         |N         |
|paused            |S       |N         |N         |
|category          |S       |S         |S         |
|running           |S       |N         |N         |
|done              |S       |CT        |CT        |
|fresh_rate        |C       |CT        |CT        |
|done_percentage   |N       |CT        |CT        |
|done_counts       |S(0-1)  |CT        |CT        |
|elapsed           |C       |C         |C         |
|left              |N       |C         |C         |
|buffer            |N       |SC        |SC        |
|whole_time        |N       |S         |S         |
|difficulty        |S(0-10) |CT(0-10)  |CT(0-10)  |
|level             |C(1-6)  |C(1-6)    |C(1-6)    |
|todo              |S       |N         |N         |
|attack            |S       |S         |N         |
|abstract_text     |N       |S         |N         |
|title             |N       |N         |S         |
|note              |N       |N         |S         |

- S: set
- N: none
- C: caluculate
- T: total 

- (num): range

## Calcs
### signed_deviation
Deviation with an information of which side(plus or minus) has more elements.
### fresh_rate

## Feature Drafts
- Level shows an average of achieved time.

