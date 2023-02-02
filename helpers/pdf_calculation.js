const numberToWord = require('./number_to_word')
module.exports = (items) => {
    let subTotal=0, cgstTotal=0, sgstTotal=0, total=0, totalInWords, i=1
    for(item of items){
        let discount = Math.floor(Math.random()*50)
        let cgst = item.itemId.GST/2
        let sgst = item.itemId.GST/2

        let price = item.quantity*item.itemId.MRP
        let cgstAmount = price*cgst/100
        let sgstAmount = price*sgst/100
        let amount = price*(100-discount)/100

        subTotal += amount
        cgstTotal += cgstAmount
        sgstTotal += sgstAmount

        item.discount = discount
        item.cgst = cgst
        item.sgst = sgst
        item.sgstAmount = sgstAmount
        item.cgstAmount = cgstAmount
        item.amount = amount
        item.sno = i
        i++
    }

    total = subTotal + cgstTotal + sgstTotal
    totalInWords = numberToWord(Math.round(total))

    const ans = {
        items, subTotal, cgstTotal, sgstTotal, total, totalInWords
    }

    return ans
}


// {
//     itemId: {
//       _id: '63d9692420ee19f476c6aa1e',
//       DSIN: 'MAG-100471.05',
//       NAME: "Magmus 3' Brass Locking L Hinges Satin Silver Premium 3' x 3/8 x 1.1/4 x 6 mm",
//       MRP: 199,
//       HSN_CODE: 83021020,
//       GST: '18',
//       __v: 0
//     },
//     quantity: 5,
//     _id: '63da2d1fa0e7736226a1c548',
//     discount: 37.47484359940665,
//     cgst: 9,
//     sgst: 9,
//     sgstAmount: 89.55,
//     cgstAmount: 89.55,
//     amount: 622.1253061859038,
//     sno: 1
// }