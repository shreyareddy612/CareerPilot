import { useContext } from "react";
import { Logout } from "../utils/functions";
import { store } from "../utils/store";
import avatar from "../assets/spl2pic.jpg";
import avatar2 from "../assets/2754579_business man_man_avatar_icon.jpg";

const Layout = ({ children }) => {
  const {
    state: { user },
  } = useContext(store);

  const username = user?.userName ? user.userName : "Dummy Username";
  const firstname = user?.first_name ? user.first_name : "Dummmy";
  const lastname = user?.last_name ? user.last_name : "name";
  const name = firstname + " " + lastname;
  const email = user?.email ? user.email : "Dummy@email.com";
  const contact = user?.phone_number ? user.phone_number : "dummycontact";

  return (
    <div className="layout">
      <div className="header" style={{ background: "" }}>
        <div className="brand">CareerPilot</div>
        <div className="rightNav">
          <div className="Avatar">
            <img src={avatar} alt="user" />
            <div className="text">{username}</div>
          </div>
          <ul className="sideBar"></ul>
          <div className="rightItem">
            <div className="logoutButton" onClick={Logout}>
              <div className="text">Logout</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bodyHolder">
        <div className="leftSideBar">
          <div class="profile-card">
            <div className="profile-card-header">
              <div className="profile-image">
                <img
                  style={{ width: "100%", borderRadius: "10%" }}
                  src={avatar2}
                  alt="user"
                />
              </div>

              <div className="profile-info">
                <h3 className="profile-name">{username}</h3>
              </div>
            </div>

            <div className="profile-card-body">
              <div className="status">
                {/* <li>
                                    <span className="status-value">Usernam: </span>
                                    <span className="status-text">{username}</span>
                                </li> */}
                <li>
                  <span className="status-value">Email: </span>
                  <span className="status-text">{email}</span>
                </li>

                <li>
                  <span className="status-value">Contact: </span>
                  <span className="status-text">{contact}</span>
                </li>
              </div>
            </div>
          </div>
        </div>
        <div className="mainContent">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
