import mongoose from "mongoose";
import mocha from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

import index from "../index.js";
import Contact from "../models/contact.js";

let should = chai.should();

chai.use(chaiHttp);

describe('Contacts', () => {
    beforeEach(() => {
        Contact.remove({}, err => {
            return (err)
        })
    })

    describe('/GET contact', ()=>{
        it('it should get all contacts', ()=> {
            chai.request(index)
                .get("/")
                .end((err, res)=> {
                    res.should.have.status(200)
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                
            })
        });
    });
    
    describe('/POST contact', ()=>{
        it('it should POST a contact ', () => {
            let contact = {
                firstName: "John",
                lastName: "Test",
                email: "john@testemail.com",
                phoneNumber: "7836654677"
            }
            chai.request(index)
                .post('/')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact created successfully');
                    res.body.contact.should.have.property('firstName');
                    res.body.contact.should.have.property('lastName');
                    res.body.contact.should.have.property('email');
                    res.body.contact.should.have.property('phoneNumber');
            });
        });

        it('it should not accept email already in the database', () =>{
            let contact = {
                firstName: "John",
                lastName: "Test",
                email: "john@testemail.com",
                phoneNumber: "7836654677"
            }
            chai.request(index)
                .post('/')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error')
                    res.body.should.have.property('error').eql("Email is already in use");
            });
        })
    });
    
    describe('/PUT/:_id contact', () => {
        it('it should UPDATE a contact given the id', () => {
            let contact = new Contact({firstName: "John", lastName: "Test", email: "john@testemail.com", phoneNumber: "566678976"})
            contact.save((err, contact) => {
                chai.request(index)
                  .put('/' + contact._id)
                  .send({firstName: "John", lastName: "Test", email: "johntest@emailtest.com", phoneNumber: "566678976"})
                  .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Contact updated successfully');
                        res.body.contact.should.have.property('email').eql("johntest@emailtest.com");
                });
            });
        });
    }); 
    
    describe('/DELETE/:_id contact', () => {
        it('it should DELETE a contact given the id', () => {
            let contact = new Contact({firstName: "John", lastName: "Test", email: "john@testemail.com", phoneNumber: "566678976"})
            contact.save((err, contact) => {
                chai.request(index)
                    .delete('/' + contact._id)
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Contact successfully deleted!');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                });
            });
        });
    });
})

