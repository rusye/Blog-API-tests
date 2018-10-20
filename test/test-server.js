const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Post", function() {
	before(function() {
			return runServer();
	});

	after(function() {
			return closeServer();
	});


	it("Should display blog posts on GET", function() {
		return chai
			.request(app)
			.get("/blog-posts")
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a("array");
				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = ["id", "title", "content", "author", "publishDate"];
				res.body.forEach(function(item) {
					expect(item).to.be.a("object");
					expect(item).to.include.keys(expectedKeys);
				});
			});
	});


	it("Should add a new blog post on POST", function() {
		const newItem = {
			title: "How to coffee", 
			content: "First find a table and then sit down and drink coffee", 
			author: "Jas Daz"};
		return chai
			.request(app)
			.post("/blog-posts")
			.send(newItem)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a("object");
				expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(
					Object.assign(newItem, {id: res.body.id}, {publishDate: res.body.publishDate})
				);
			});
	});


	it("should update the blog post on PUT", function() {
		const updateData = {
      title: "How to tea", 
			content: "First find a table and then sit down and drink tea", 
			author: "Saj Zad"
    };

    return 
      chai
				.request(app)
				.get("/blog-posts")
        .then(function(res) {
					updateData.id = res.body[0].id;
				  return chai
            .request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
				})
			.then(function(res) {
				expect(res).to.have.status(204);
				expect(res).to.be.json;
				expect(res.body).to.be.a("object");
				expect(res).to.deep.equal(updateData);
			})
	});


	it("It should delete a blog post on DELTE", function() {
		return chai
			.request(app)
			.get("/blog-posts")
			.then(function(res) {
				return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			})
	});
});