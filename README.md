# alpacafi - lending on alephium
<i> How much can you possibly know about yourself if you've never been in a fight. </i>

## Tests to Add (Non-Critical)
- [ ] repay non-liquidation loan
- [ ] cancel non-liquidation loan
- [ ] destroy fee collector (responsibly, we dont want loan held hostage)

## Unit Testing
- [ ] pool loan deposit
- [ ] pool loan withdraw
  - [ ] check values and math closely
- [ ] pool loan borrow
- [ ] pool loan repay
- [ ] pool loan liquidate
  - [ ] check token math and calculations
- [ ] redeem sToken on yeild

## Notes
  
I need to work to implement the following `pool borrow limits` and `health factor`.

`Health Factor = (Total Collateral Value * Weighted Average Liquidation Threshold) / Total Borrow Value`



