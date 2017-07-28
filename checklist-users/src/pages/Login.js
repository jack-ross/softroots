import React, { Component } from "react";
import { Input, Button } from "antd";
import { Link } from "react-router-dom";
import ViewChecklist from "../components/ViewChecklist.js";
import loginValidation from "../validation/loginValidation.js";

const testData = {
  title: "Night With Viper",
  description: "What to do on a long night with your favorite dog.",
  subsections: [
    {
      title: "Feeding Viper",
      subtasks: [
        {
          shortDescription: "Put food in bowl",
          longDescription: "Use 100% fresh doggo food."
        },
        {
          shortDescription: "Clean bowl.",
          longDescription:
            "Don't use bleach unless you want a doggo with a very sick tummy :("
        }
      ]
    },
    {
      title: "Clothing Viper",
      subtasks: [
        {
          shortDescription: "Buy a suit",
          longDescription: "Make sure it's Barney Stinson approved."
        },
        {
          shortDescription: "Suit up.",
          longDescription:
            "Viper needs to look classy, so be sure that he can squeeze in.  Make sure it accentuates those muscles - we wouldn't want all of Mike's training to go to waste now, would we?"
        }
      ]
    }
  ]
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        email: "",
        password: ""
      }
    };
  }

  onClickSubmit() {
    // TODO verify input, then try firebase login
    if (loginValidation(this.state.userInfo)) {
      // Login with firebase auth
    }
  }

  onChange(field, value) {
    let userInfo = this.state.userInfo;
    userInfo[field] = value;
    this.setState({
      ...this.state,
      userInfo: userInfo
    });
  }

  render() {
    return (
      <div style={{ padding: "10%" }}>
        <h3> Email: </h3>
        <Input onChange={e => this.onChange("email", e.target.value)} />
        <div style={{ margin: "12px 0" }} />

        <h3> Password: </h3>
        <Input onChange={e => this.onChange("password", e.target.value)} />
        <div style={{ margin: "12px 0" }} />

        <Link to="/">
          <Button> Cancel </Button>
        </Link>
        <Button type="primary" onClick={() => this.onClickSubmit()}>
          {" "}Login{" "}
        </Button>
        <ViewChecklist checklist={testData} />
      </div>
    );
  }
}
