import Vue from "vue";
import app from "app.vue";

describe("App", () => {
    it("takes a string and capitalises first letter of each word", () => {
      expect(app.captilaliseFirstLetter("a big cat")).toBe("A Big Cat")  
    })
})