const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const methodOverride = require('method-override')


app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride("_method"))

app.set("view engine", 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
            ;
    }
})

const upload = multer({ storage: storage })
let userData = [
    {
        id: uuidv4(),
        username: 'shreekantha',
        userImg: '/uploads/cat1.avif',
        tagline: "Be happy",
        comment: "nice picture"
    },
    {
        id: uuidv4(),
        username: 'Ramu',
        userImg: '/uploads/cat2.avif',
        tagline: "kepp working",
        comment: "nice tagline"
    },

]

app.get("/", (req, res) => {
    res.redirect("/userData");
});

app.get('/userData', (req, res) => {
    res.render('index.ejs', { userData })
})

app.get('/userData/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/userData', upload.single('userImg'), (req, res) => {
    // console.log(req.body)
    // console.log(req.file)
    let { username, tagline, comment } = req.body
    let id = uuidv4();
    let userImg = req.file ? '/uploads/' + req.file.filename : '/uploads/default.png';
    userData.unshift({ id, userImg, username, tagline, comment })
    res.redirect('/userData')
})

app.get('/userData/:id', (req, res) => {
    let { id } = req.params
    let user = userData.find((p) => id === p.id)
    // console.log(user)
    res.render('view.ejs', { user })
    // res.send("view page working..")
})


app.put('/userData/:id', upload.single('userImg'), (req, res) => {
    let { id } = req.params;
    let index = userData.findIndex((p) => id === p.id)
    // console.log(index)
    let { username, tagline, comment } = req.body

    let userImg = req.file ? '/uploads/' + req.file.filename : userData[index].userImg;
    userData[index] = ({ id, userImg, username, tagline, comment })
    res.redirect('/userData')
})

app.get('/userData/:id/edit', (req, res) => {
    let { id } = req.params
    let user = userData.find((p) => id === p.id)
    res.render('edit.ejs', { user })
})

app.delete('/userData/:id', (req, res) => {
    let { id } = req.params
    userData = userData.filter((p) => id !== p.id)
    res.redirect('/userData')
})

//view comments
app.get('/userData/:id/comment', (req, res) => {
    let { id } = req.params
    let comments = userData.find((p) => id === p.id)
    // console.log(comments)
    res.render('viewcomment.ejs', { comments })
})

//edit and add comments
app.get('/userData/:id/comment/editcomm', (req, res) => {
    let { id } = req.params
    let editcomments = userData.find((p) => id === p.id)
    res.render('editAddComments.ejs', { editcomments })
})

app.put('/userData/:id/comment/editcomm', (req, res) => {
    let { id } = req.params;
    let newComment = req.body.comment ;
    let editCom = userData.find((p) => id === p.id)
    if(editCom){
        if(editCom.comment){
            editCom.comment = `\n${newComment}`
        } else{
            editCom.comment = newComment
        }
    }
    res.redirect('/userData')
})

app.delete('/userData/:id/comment', (req, res) => {
    let { id } = req.params
    let userComment = userData.find((p) => id === p.id)
    if(userComment){
        userComment.comment='';
    }
    res.redirect('/userData')
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });