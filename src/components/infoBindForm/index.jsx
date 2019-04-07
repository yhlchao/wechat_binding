import React, { Component } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Snackbar,
  SnackbarContent,
  withStyles
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import WarningIconOverride from "../material/WarningIconOverride";
import { getDormitory, bindInfo, getCollege } from "../../api/bind";
import { loStorage } from "../../model/storage";

const yhlStyle = () => ({
  error: {
    backgroundColor: red[500]
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

const collegeState = ["学院信息获取中..", "学院信息获取失败！"];
const dormitoryState = ["宿舍信息获取中..", "宿舍信息获取失败！"];
const mastInput = ["sdut_id", "college", "dormitory", "room", "password_jwc"];

class InfoBindForm extends Component {
  constructor(props) {
    super(props);
    if (loStorage.get("info")) {
      this.props.history.replace("/user");
    }
    this.state = {
      sdut_id: {
        title: "学号",
        content: "" //str
      },
      college: {
        title: "学院",
        content: "" //int
      },
      class: "", //str
      dormitory: {
        title: "宿舍楼号",
        content: "" //int
      },
      room: {
        title: "房间号",
        content: "" //int
      },
      password_jwc: {
        title: "教务处密码",
        content: ""
      }, //str
      password_dt: "", //str
      showPassword_jwc: false,
      showPassword_dt: false,
      collegeList: "",
      isCollege: collegeState[0],
      dormitoryList: "",
      isDormitory: dormitoryState[0],
      snackbarOpen: false,
      snackbarVertical: "top",
      snackbarHorizontal: "center",
      snackbarContent: ""
    };
  }

  componentDidMount() {
    if (this.props.history.location.pathname === "/bind") {
      this.getCollege();
      this.getDormitory();
    }
  }

  // 异步获取学院信息
  getCollege = async () => {
    const data = await getCollege().catch(() => {
      this.setState({
        isCollege: collegeState[1]
      });
      return false;
    });
    if (data) {
      this.setState({
        collegeList: data.data
      });
    }
  };

  getDormitory = async () => {
    const data = await getDormitory().catch(() => {
      this.setState({
        isDormitory: dormitoryState[1]
      });
      return false;
    });
    if (data) {
      this.setState({
        dormitoryList: data.data
      });
    }
  };

  // 选择框
  getSelData = event => {
    this.setState({
      [event.target.name]: {
        content: event.target.value
      }
    });
  };

  // 输入框
  getInputData = e => {
    const inputName = e.target.name;
    if (
      inputName === "sdut_id" ||
      inputName === "room" ||
      inputName === "password_jwc"
    ) {
      this.setState({
        [inputName]: {
          content: e.target.value
        }
      });
    } else {
      this.setState({
        [inputName]: e.target.value
      });
    }
  };

  checkForm = () => {
    for (const key in mastInput) {
      if (mastInput.hasOwnProperty(key)) {
        const element = mastInput[key];
        if (this.state[element].content === "") {
          this.handleShowSnackbar(element);
          return;
        }
      }
    }
    return true;
  };

  handleSub = () => {
    if (this.checkForm()) {
      this.bindInfo();
    }
  };

  bindInfo = async () => {
    const subData = {
      sdut_id: this.state.sdut_id.content,
      college: parseInt(this.state.college.content),
      class: this.state.class,
      dormitory: parseInt(this.state.dormitory.content),
      room: parseInt(this.state.room.content),
      password_jwc: this.state.password_jwc.content,
      password_dt: this.state.password_dt
    };
    const header = {
      Authorization: "Bearer " + loStorage.get("meta").access_token
    };
    const data = await bindInfo(subData, header).catch(err => {
      console.log(err);
    });
    if (!data) {
    }
  };

  handleClickShowPasswordJwc = () => {
    this.setState({
      showPassword_jwc: !this.state.showPassword_jwc
    });
  };
  handleClickShowPasswordDt = () => {
    this.setState({
      showPassword_dt: !this.state.showPassword_dt
    });
  };
  handleShowSnackbar = key => {
    this.setState({
      snackbarOpen: true,
      snackbarContent: this.state[key].title
    });
  };
  handleCloseSnackbar = () => {
    this.setState({
      snackbarOpen: false
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className="page_bd">
        <TextField
          error={false}
          label="学号 *"
          name="sdut_id"
          placeholder="请输入学号"
          fullWidth={true}
          margin="dense"
          onChange={this.getInputData}
          className="form-font-size"
        />

        <TextField
          select
          margin="dense"
          fullWidth={true}
          label="学院 *"
          value={this.state.college.content}
          name="college"
          onChange={this.getSelData}
          SelectProps={{
            native: true
          }}
        >
          <option value="" disabled />
          {!this.state.collegeList ? (
            <option value="1" disabled>
              {this.state.isCollege}
            </option>
          ) : (
            this.state.collegeList.map(item => {
              return (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              );
            })
          )}
        </TextField>
        <TextField
          label="班级"
          name="class"
          placeholder="请输入所在班级"
          fullWidth={true}
          margin="dense"
          onChange={this.getInputData}
        />
        <TextField
          select
          margin="dense"
          fullWidth={true}
          label="宿舍楼号 *"
          value={this.state.dormitory.content}
          name="dormitory"
          onChange={this.getSelData}
          SelectProps={{
            native: true
          }}
        >
          <option value="" disabled />
          {!this.state.dormitoryList
            ? this.state.isDormitory
            : this.state.dormitoryList.map(item => {
                return (
                  <option value={item.id} key={item.id}>
                    {item.description}
                  </option>
                );
              })}
        </TextField>
        <TextField
          label="房间号 *"
          name="room"
          placeholder="请输入房间号"
          fullWidth={true}
          margin="dense"
          onChange={this.getInputData}
        />

        <FormControl fullWidth={true} margin="dense">
          <InputLabel>教务处密码 *</InputLabel>
          <Input
            type={this.state.showPassword_jwc ? "text" : "password"}
            onChange={this.getInputData}
            name="password_jwc"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPasswordJwc}
                >
                  {this.state.showPassword_jwc ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth={true} margin="dense">
          <InputLabel>网上服务大厅密码</InputLabel>
          <Input
            type={this.state.showPassword_dt ? "text" : "password"}
            onChange={this.getInputData}
            name="password_dt"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPasswordDt}
                >
                  {this.state.showPassword_dt ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button
          fullWidth={true}
          className="page_button"
          variant="contained"
          color="primary"
          onClick={this.handleSub}
        >
          提交
        </Button>

        <Snackbar
          anchorOrigin={{
            vertical: this.state.snackbarVertical,
            horizontal: this.state.snackbarHorizontal
          }}
          open={this.state.snackbarOpen}
          onClose={this.handleCloseSnackbar}
          autoHideDuration={1500}
        >
          <SnackbarContent
            classes={{
              root: classes.error
            }}
            message={
              <span className={classes.message}>
                <WarningIconOverride />
                未填写{this.state.snackbarContent}
              </span>
            }
          />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(yhlStyle)(InfoBindForm);
