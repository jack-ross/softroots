import React, { Component } from "react";
import { Button, Modal, notification } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import PleaseLogin from "../components/PleaseLogin.js";
import ChecklistValidation from "../validation/ChecklistValidation.js";
import ChecklistForm from "../components/ChecklistForm.js";
import submitChecklist from "../firebase/submitChecklist.js";
import FindPreexistingListModal from "../components/FindPreexistingListModal.js";
import roleHierarchy from "../roles/roleHierarchy.js";
import firebase from "../configs/firebaseConfig.js";
import "../css/CreateOrEditChecklist.css";

const tabs = [
    {
        name: "Home",
        url: "/home"
    },
    {
        name: "Create Checklist",
        url: "/createchecklist"
    },
    {
        name: "View Checklist",
        url: "/viewchecklists"
    },
    {
        name: "Manage",
        url: "/users"
    }
];

export default class CreateOrEditChecklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newChecklist: {
                title: "",
                description: "",
                subsections: [],
                daysToRepeat: [],
                endTimes: [],
                locations: [],
                roles: [],
                phoneNumbers: [""],
                emails: [""]
            },
            allChecklists: undefined,
            isPreexistingModalVisible: false
        };
    }

    componentWillMount() {
        firebase
            .database()
            .ref("/checklists/")
            .on("value", snapshot => {
                this.setState({
                    ...this.state,
                    allChecklists: snapshot.val()
                });
            });

        firebase
            .database()
            .ref("/roles")
            .on("value", snapshot => {
                if (snapshot.val()) {
                    this.setState({
                        ...this.state,
                        roles: snapshot.val()
                    });
                } else {
                    this.setState({
                        ...this.state,
                        roles: ["error loading roles"]
                    });
                }
            });
    }

    updateField(field, value, index) {
        let updatedChecklist = this.state.newChecklist;
        if (index >= 0) {
            updatedChecklist[field][index] = value;
        } else {
            updatedChecklist[field] = value;
        }
        this.setState({
            ...this.state,
            newChecklist: updatedChecklist
        });
    }

    handleAddPhoneNumber = () => {
        let temp = this.state.newChecklist;
        temp.phoneNumbers.push("");
        this.setState({
            newChecklist: temp
        });
    };

    handleAddEmail = () => {
        let temp = this.state.newChecklist;
        temp.emails.push("");
        this.setState({
            newChecklist: temp
        });
    };

    handleRemovePhoneNumber = index => {
        let temp = this.state.newChecklist;
        temp.phoneNumbers.splice(index, 1);
        this.setState({
            newChecklist: temp
        });
    };

    handleRemoveEmail = index => {
        let temp = this.state.newChecklist;
        temp.emails.splice(index, 1);
        this.setState({
            newChecklist: temp
        });
    };

    switchModalVisibility() {
        this.setState({
            ...this.state,
            isPreexistingModalVisible: !this.state.isPreexistingModalVisible
        });
    }

    onSelectPreexistingChecklist(checklist) {
        this.setState({
            ...this.state,
            newChecklist: checklist,
            isPreexistingModalVisible: false
        });
    }

    render() {
        if (!this.props.userInfo) {
            return <PleaseLogin />;
        }

        const preexistingListModal = (
            <div>
                <p
                    style={{ cursor: "pointer", color: "#108ee9" }}
                    onClick={() => this.switchModalVisibility()}
                >
                    {" "}
                    Import Checklist{" "}
                </p>
                <div style={{ margin: "20px" }} />
                <FindPreexistingListModal
                    checklists={this.state.allChecklists}
                    locations={
                        this.props.userInfo.role === "Admin"
                            ? Object.keys(this.state.roles)
                            : [this.props.userInfo.location]
                    }
                    roles={roleHierarchy[this.props.userInfo.role]}
                    onClickSelect={checklist =>
                        this.onSelectPreexistingChecklist(checklist)
                    }
                    onCancel={() => this.switchModalVisibility()}
                    isVisible={this.state.isPreexistingModalVisible}
                />
            </div>
        );

        return (
            <div>
                <TopNavBar
                    className="horizontal"
                    tabs={tabs}
                    onClickSignOut={this.props.onClickSignOut}
                />
                <div className="createEditPage" style={{ padding: "30px 0" }}>
                    {this.state.allChecklists && preexistingListModal}

                    <ChecklistForm
                        checklistData={this.state.newChecklist}
                        updateField={(field, value, index) =>
                            this.updateField(field, value, index)
                        }
                        userInfo={this.props.userInfo}
                        handleAddPhoneNumber={this.handleAddPhoneNumber}
                        handleAddEmail={this.handleAddEmail}
                        handleRemoveEmail={index => this.handleRemoveEmail}
                        handleRemovePhoneNumber={index =>
                            this.handleRemovePhoneNumber
                        }
                    />
                </div>
            </div>
        );
    }
}
