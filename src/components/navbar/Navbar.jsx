import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, NavLink, Outlet } from "react-router-dom";
import Friends from "./images/1.png";
import Groups from "./images/2.png";
import Market from "./images/3.png";
import Watch from "./images/4.png";
import Memories from "./images/5.png";
import Events from "./images/6.png";
import Gaming from "./images/7.png";
import Gallery from "./images/8.png";
import Videos from "./images/9.png";
import Messages from "./images/10.png";
import Tutorials from "./images/11.png";
import Courses from "./images/12.png";
import Fund from "./images/13.png";
const Navbar = () => {

  return (
    <>
      <header className="page-header row" style={{ position: "fixed" }}>
        <div className="logo-wrapper d-flex align-items-center col-auto">
          <div className="left">
            <ul className="header-right">
              <li className="">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <span>lamasocial</span>
                </Link>
              </li>
              <li className="modes d-flex">
                <HomeOutlinedIcon />
              </li>
              <li className="modes d-flex">
                <GridViewOutlinedIcon />
              </li>
              <li className="modes d-flex">
                <a className="close-btn"
                // onClick={toggleSidebar}
                >
                  <div className="toggle-sidebar">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                </a>
              </li>

            </ul>
          </div>
        </div>
        <div className="page-main-header col">
          <div className="header-left d-lg-block d-none">
            <form className="search-form mb-0">
              <div className="input-group"><span className="input-group-text pe-0">
                <SearchOutlinedIcon /></span>
                <input className="form-control" type="text" placeholder="Search anything..." />
              </div>
            </form>
          </div>
          <div className="nav-right">
            <ul className="header-right">
              <li className="modes d-flex">
                <PersonOutlinedIcon />
              </li>
              <li className="modes d-flex">
                <EmailOutlinedIcon />

              </li>
              <li className="modes d-flex">
                <NotificationsOutlinedIcon />
              </li>
              <li className="modes d-flex">
                <div className="user">
                  <img
                    src={"/upload/"}
                    alt=""
                  />
                  <span>{"test"}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className="page-body-wrapper">
        {/* <!-- Page sidebar start--> */}
        <div className="overlay"></div>

        <aside className="page-sidebar" style={{ overflowY: "auto" }} data-sidebar-layout="stroke-svg">
          <div id="sidebar-menu" >
            <div className="container">
              <div className="menu">
                <div className="item">
                  <NavLink to={'/userList'}>
                    <img src={Friends} alt="" />
                    <span>Friends</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/groupList'}>
                    <img src={Groups} alt="" />
                    <span>Groups</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Market} alt="" />
                    <span>Marketplace</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Watch} alt="" />
                    <span>Watch</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Memories} alt="" />
                    <span>Memories</span>
                  </NavLink>
                </div>
              </div>
              <hr />
              <div className="menu">
                <span>Your shortcuts</span>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Events} alt="" />
                    <span>Events</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Gaming} alt="" />
                    <span>Gaming</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Gallery} alt="" />
                    <span>Gallery</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Videos} alt="" />
                    <span>Videos</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Messages} alt="" />
                    <span>Messages</span>
                  </NavLink>
                </div>
              </div>
              <hr />
              <div className="menu">
                <span>Others</span>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Fund} alt="" />
                    <span>Fundraiser</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Tutorials} alt="" />
                    <span>Tutorials</span>
                  </NavLink>
                </div>
                <div className="item">
                  <NavLink to={'/'}>
                    <img src={Courses} alt="" />
                    <span>Courses</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className='page-body'
          style={{
            transition: "margin-left 0.3s ease-in-out"
          }}
        >
          <br />
          <br />
          <br />
          <Outlet />
        </div>
        <footer className="footer text-center "
          style={{
            transition: "margin-left 0.3s ease-in-out",
            // background: "white"
          }}
        >
          <p>&copy; 2024 EasyArchive. All rights reserved.</p>
          <p className="text-muted">Crafted with care by Anderson Kamsong.</p>
        </footer>
      </div>
    </>
  );
};

export default Navbar;
