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

## Diagrams

![image](https://github.com/user-attachments/assets/81036372-859c-4bf2-bc4b-3027db076517)

### Control Flow

![image](https://github.com/user-attachments/assets/d946c206-3905-4328-aa96-ef894df8a0ed)





