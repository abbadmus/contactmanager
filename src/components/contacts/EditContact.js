import React, { Component } from "react";
import { Consumer } from "../../context";
// import { v4 as uuidv4 } from "uuid";
import TextInputGroup from "../layout/TextInputGroup";
import Axios from "axios";

class EditContact extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    errors: {},
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const res = await Axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    const contact = res.data;
    this.setState({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  HandleSubmit = async (dispatch, e) => {
    e.preventDefault();

    const { name, email, phone } = this.state;

    if (name === "") {
      this.setState({ errors: { name: "Name is required" } });
      return;
    }
    if (email === "") {
      this.setState({ errors: { email: "Email is required" } });
      return;
    }
    if (phone === "") {
      this.setState({ errors: { phone: "Phone is required" } });
      return;
    }

    const updateContact = {
      name,
      email,
      phone,
    };

    const { id } = this.props.match.params;
    const res = await Axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updateContact);

    dispatch({ type: "UPDATE_CONTACT", payload: res.data });
    // clear state
    this.setState({
      name: "",
      email: "",
      phone: "",
      errors: {},
    });

    this.props.history.push("/");
  };

  render() {
    const { name, email, phone, errors } = this.state;

    return (
      <Consumer>
        {(value) => {
          const { dispatch } = value;
          return (
            <div className="card mb-3">
              <div className="card-header">Update Contact</div>
              <form onSubmit={this.HandleSubmit.bind(this, dispatch)}>
                <TextInputGroup name="name" label="Name" value={name} placeholder="Enter Name..." onChange={this.handleChange} error={errors.name} />

                <TextInputGroup
                  name="email"
                  label="Email"
                  value={email}
                  placeholder="Enter Email..."
                  onChange={this.handleChange}
                  type="email"
                  error={errors.email}
                />

                <TextInputGroup
                  name="phone"
                  label="Phone"
                  value={phone}
                  placeholder="Enter Phone..."
                  onChange={this.handleChange}
                  error={errors.phone}
                />

                <input type="submit" value="Update Contact" className="btn btn-primary btn-block" />
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default EditContact;
