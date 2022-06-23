const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./src/routes/auth.router')
const cors = require('cors')
const Users = require('./src/models/Users')
const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', 'views')
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/', authRouter)

async function start() {
  try {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log(`Connection to DB success.`)

    const PORT = process.env.PORT
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
// var MongoClient = require('mongodb').MongoClient
// var url = process.env.DATABASE_URL

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err
//   var dbo = db.db('FinTech')
//   var myobj = [
//     {
//       name: 'The Automatic Millionaire',
//       content:
//         '“The Automatic Millionaire,” kicks off with the story of a couple earning $55,000 combined annually, and how they achieved their financial dreams. Think: owning two homes, putting their children through college, and retiring at 55 with a $1 million retirement nest egg. The secret? Setting up a financial system that not only pays yourself first but one that is automatic. Bach has also written "Smart Women Finish Rich," "Smart Couples Finish Rich," and "Start Late, Finish Rich."',
//       category: 'ForAdults',
//     },

//     {
//       name: 'Broke Millennial',
//       content:
//         'Erin Lowry’s “Broke Millennial” explains in her signature conversational style how 20-somethings can get in control of their personal finances. From understanding your relationship with money to managing student loans to sharing the details of your finances with a partner, this book covers the biggest money challenges facing millennials today.',
//       category: 'ForAdults',
//     },

//     {
//       name: 'Your Money or Your Life',
//       content:
//         'With more than a million copies sold, Vicki Robin’s “Your Money or Your Life” lays out an easy-to-follow, nine-step plan to help readers change their relationship with money. Whether it’s how to get out of debt, get started investing, how to build wealth, or even save money by practicing Robin’s signature mindfulness technique, this read has you covered.',
//       category: 'ForAdults',
//     },

//     {
//       name: 'The total money makeover',
//       content:
//         '“I Will Teach You to Be Rich” by Ramit Sethi is a great book for older teenagers who want to begin adulthood on the right financial foot.Sethi’s New York Times best-selling book offers a simplified approach to financial literacy that focuses on motivation and goal setting rather than reactionary decision making or painstaking optimization. In the book, Sethi argues that many young people fail to build wealth not because it’s difficult or impossible, but because they become so overwhelmed with minutiae—like attempting to time the market perfectly before investing or endlessly analyzing the difference between two very similar portfolios—that they often do nothing rather than risk making the “wrong” decision. Sethi offers an alternative to this all-or-nothing approach and does so in simple actionable steps that encourage lifelong financial responsibility.',
//       category: 'ForAdults',
//     },

//     {
//       name: 'Rich Dad Poor Dad',
//       content:
//         '“Rich Dad Poor Dad," in one of the most popular personal finance books of all time, Kiyosaki shares what he learned growing up from his father and his friend’s father, the latter of which is the “rich dad” in the title. Those lessons include how you don’t need to make a lot of money to get rich, assets and liabilities, and explains to parents why schools won’t teach your kids what they need to know about personal finance. This 20th-anniversary edition includes an update from the author on all things money, the economy, and investing.',
//       category: 'ForAdults',
//     },

//     {
//       name: 'I Want More Pizza',
//       content:
//         '“I Want More Pizza” by Steve Burkholder approaches the subject of personal finance in a way that’s accessible to kids. Burkholder’s writing is entertaining and clear, offering the young reader plenty of relatable anecdotes, examples, and hypothetical questions to ponder. Rather than just telling, Burkholder shows the reader why and how managing money well is so important. The book includes an engaging introductory section followed by four larger sections, each referred to as “slices.” The first slice covers “You” and is focused on the reader’s relationship to money, behavior with money, and future goals. The second slice is titled “Saving” and does an excellent job covering the basics of tracking spending and saving money, even on a small income. The third slice, “Growing Your Savings,” is dedicated to investing and compound growth. The fourth and final slice is called “Debt,” which explains debt, credit cards, and paying for college. “I Want More Pizza” is an all-around great introduction to financial literacy for teens and pre-teens.',
//       category: 'ForTeens',
//     },

//     {
//       name: 'I Will Teach You to Be Rich',
//       content:
//         '“I Will Teach You to Be Rich” by Ramit Sethi is a great book for older teenagers who want to begin adulthood on the right financial foot.Sethi’s New York Times best-selling book offers a simplified approach to financial literacy that focuses on motivation and goal setting rather than reactionary decision making or painstaking optimization. In the book, Sethi argues that many young people fail to build wealth not because it’s difficult or impossible, but because they become so overwhelmed with minutiae—like attempting to time the market perfectly before investing or endlessly analyzing the difference between two very similar portfolios—that they often do nothing rather than risk making the “wrong” decision. Sethi offers an alternative to this all-or-nothing approach and does so in simple actionable steps that encourage lifelong financial responsibility.',
//       category: 'ForTeens',
//     },

//     {
//       name: 'Why Didn’t They Teach Me This in School?',
//       content:
//         'Aimed at high school and college students, “Why Didn’t They Teach Me This in School?” by Cary Siegel is a great book for teens of any age who want to learn the principles that underlie lifelong financial health. Rather than giving traditional budgeting how-to’s or specific investing advice, Siegel’s book outlines the larger habits and life planning skills that contribute to a person’s financial outcomes. Breaking each principle into its own chapter makes this book an especially good fit for teens who prefer perusing chapters sporadically, rather than reading a book start-to-finish.',
//       category: 'ForTeens',
//     },

//     {
//       name: 'Clever Girl Finance',
//       content:
//         '“Clever Girl Finance” reads like a companionable book about personal empowerment while also comprehensively teaching the reader about the nuts and bolts of personal finance. While not written specifically for teenagers, this book by Bola Sokunbi provides an elegant approach to holistic money management. Sokunbi’s writing style is so relatable and personable, that high school-aged readers who shy away from other personal finance books may well find themselves eagerly devouring “Clever Girl Finance.”',
//       category: 'ForTeens',
//     },

//     {
//       name: 'What You Should Have Learned About Money, But Never Did',
//       content:
//         ' “What You Should Have Learned About Money, But Never Did” offers readers an introduction to personal finance basics like establishing financial goals, paying down debt, starting an emergency fund, and saving for retirement. The author’s conversational writing style and focus on setting up good habits early on make this a great book for teens who are entering the workforce for the first time.',
//       category: 'ForTeens',
//     },
//     {
//       name: 'Money Bags',
//       category: 'Games'

//     },
//     {
//       name: 'The Game of Life',
//       category: 'Games'
//     },
//     {
//       name: 'Payday',
//       category: 'Games'
//     },
//     {
//       name: 'Monopoly',
//       category: 'Games'
//     },
//     {
//       name: 'Cashflow',
//       category: 'Games'
//     },
//   ]
//   dbo.collection('Books&Games').insertMany(myobj, function (err, res) {
//     if (err) throw err
//     console.log('1 document inserted')
//     db.close()
//   })
// })
// })

const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  },
})

// const storage = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/png'
//   ) {
//     cb(null, true)
//   } else {
//     cb(null, false)
//   }
// }
var upload = multer({
  storage: storage,
})

app.post('/uploadForm', upload.array('myImg'), async (req, res, next) => {
  // if (req.file) {
  //   const pathName = req.file.path
  //   res.send(req.file, pathName)
  // }
  console.log(req.file)
})

start()
