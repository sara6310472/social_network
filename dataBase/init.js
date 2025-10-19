const { faker } = require('@faker-js/faker');
const sequelize = require('./dataBase');

const User = require('../server/models/Users');
const Post = require('../server/models/Posts');
const Todo = require('../server/models/Todos');
const Comment = require('../server/models/Comments');
const Password = require('../server/models/Passwords');

const NUM_USERS = 20;
const POSTS_PER_USER = 5;
const TODOS_PER_USER = 5;
const COMMENTS_PER_POST = 5;

const seed = async () => {
    try {

        await sequelize.sync({ force: true }); 

        for (let i = 0; i < NUM_USERS; i++) {
            const user = await User.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phoneNumber: faker.phone.number('05########'),
                website: faker.internet.url(),
            });

            await Password.create({
                userId: user.id,
                hashedPassword: '123456', 
            });

            for (let j = 0; j < POSTS_PER_USER; j++) {
                const post = await Post.create({
                    userId: user.id,
                    title: faker.lorem.sentence(),
                    body: faker.lorem.paragraphs(2),
                });

                for (let k = 0; k < COMMENTS_PER_POST; k++) {
                    await Comment.create({
                        postId: post.id,
                        name: faker.person.fullName(),
                        email: faker.internet.email(),
                        body: faker.lorem.sentences(2),
                    });
                }
            }

            for (let j = 0; j < TODOS_PER_USER; j++) {
                await Todo.create({
                    userId: user.id,
                    title: faker.lorem.words(3),
                    completed: faker.datatype.boolean(),
                });
            }
        }

        console.log("Database has been seeded successfully.");
    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        await sequelize.close();
    }
};

seed();
