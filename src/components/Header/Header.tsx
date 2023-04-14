import {Button, Layout, Space} from "antd";
import styles from "./Header.module.scss";
import Login from "../Login/Login";
import {useEffect, useState} from "react";
import "firebase/compat/auth";
import Register from "../Register/Register";
import {useAuth} from "../../contexts/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {HomeFilled} from "@ant-design/icons";

export default function Header() {
  const {isLogged, user, logout} = useAuth();

  const [loginType, setLoginType] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      setLoginType(0);
    }
  }, [isLogged]);

  return (
    <header>
      <Layout.Header data-testid='header' className={styles.container}>
        <Link to={'/'}>
          <h1 className={styles.title}><HomeFilled /> Funny Movies</h1>
        </Link>
        {
          isLogged
            ? <Space>
              Welcome, <b>{user?.email}</b>
              <Button
                data-testid="share-movie-button"
                type="primary"
                htmlType="button"
                onClick={() => navigate('/post')}
              >
                Share a movie
              </Button>
              <Button
                data-testid="logout-button"
                type="default"
                htmlType="button"
                onClick={logout}
              >
                Logout
              </Button>
            </Space>
            : <>
              {loginType === 0 && <Space>
                <Button
                  data-testid="login-button"
                  type="primary"
                  htmlType="button"
                  onClick={() => setLoginType(1)}
                >
                  Login
                </Button>
                <Button
                  data-testid="register-button"
                  type="default"
                  htmlType="button"
                  onClick={() => setLoginType(2)}
                >
                  Register
                </Button>
              </Space>}
              {loginType === 1 && <Login setLoginType={setLoginType}/>}
              {loginType === 2 && <Register setLoginType={setLoginType}/>}
            </>
        }

      </Layout.Header>
    </header>
  );
}