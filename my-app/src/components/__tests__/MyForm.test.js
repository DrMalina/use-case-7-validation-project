import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import MyFormComponent from "../MyForm";

describe("MyFormComponent", () => {
  let fillForm;

  beforeAll(() => {
    fillForm = (name, email, agreeTerms, gender) => {
      userEvent.type(screen.getByPlaceholderText("Name"), name);
      userEvent.type(screen.getByPlaceholderText("Email"), email);
      if (agreeTerms) {
        userEvent.click(
          screen.getByRole("checkbox", { name: /agree to terms/i })
        );
      }
      if (gender) {
        userEvent.click(screen.getByRole("radio", { name: gender }));
      }
    };
  });

  describe("Positive Test Cases", () => {
    test("Submit with all fields correctly filled", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "john.doe@example.com", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.queryByText("Name must be at least 3 characters.")
      ).not.toBeInTheDocument();
    });

    test("Submit with a very long valid name", () => {
      render(<MyFormComponent />);
      fillForm("J".repeat(1000), "john.doe@example.com", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.queryByText("Name must be at least 3 characters.")
      ).not.toBeInTheDocument();
    });

    test("Submit with a complex email address", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "test.name+alias@example.co.uk", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.queryByText("Email must be valid.")
      ).not.toBeInTheDocument();
    });

    test("Change gender and submit", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "john.doe@example.com", true, "Female");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.queryByText("You must select a gender.")
      ).not.toBeInTheDocument();
    });

    test("Re-submit after an initial successful submission", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "john.doe@example.com", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      fillForm("Jane Doe", "jane.doe@example.com", true, "Female");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.queryByText("You must select a gender.")
      ).not.toBeInTheDocument();
    });
  });

  describe("Negative Test Cases", () => {
    test("Submit with Name field blank", () => {
      render(<MyFormComponent />);
      fillForm("", "john.doe@example.com", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.getByText("Name must be at least 3 characters.")
      ).toBeInTheDocument();
    });

    test("Submit with invalid email address", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "john.doeexample.com", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(screen.getByText("Email must be valid.")).toBeInTheDocument();
    });

    test("Submit without checking Agree to Terms", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "john.doe@example.com", false, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.getByText("You must agree to the terms.")
      ).toBeInTheDocument();
    });

    test("Submit without selecting a gender", () => {
      render(<MyFormComponent />);
      fillForm("John Doe", "john.doe@example.com", true, "");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(screen.getByText("You must select a gender.")).toBeInTheDocument();
    });

    test("Submit with a name that is less than 3 characters long", () => {
      render(<MyFormComponent />);
      fillForm("Jo", "john.doe@example.com", true, "Male");
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(
        screen.getByText("Name must be at least 3 characters.")
      ).toBeInTheDocument();
    });
  });
});
