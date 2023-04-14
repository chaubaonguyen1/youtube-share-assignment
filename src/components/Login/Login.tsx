import {Button, Form, Input} from "antd";
import {Dispatch, useEffect, useState} from "react";
import React from 'react';
import "firebase/compat/auth";
import {useAuth} from "../../contexts/AuthContext";

interface ILoginProps {
  setLoginType: Dispatch<number>
}

interface IForm {
  email: string;
  password: string;
}

function Login({setLoginType}: ILoginProps) {
  const {login} = useAuth();

  const [form] = Form.useForm<IForm>();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values: IForm) => login(values.email, values.password);

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{required: true, type: 'email', message: undefined}]}
      >
        <Input placeholder="Email"/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{required: true, message: undefined}]}
      >
        <Input
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            data-testid="login-submit-button"
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({errors}) => errors.length).length
            }
          >
            Login
          </Button>
        )}
      </Form.Item>
      <div>
        Or
        <Button
          data-testid="or-register-button"
          type="text"
          htmlType="button"
          onClick={() => setLoginType(2)}
        >
          Register
        </Button>
      </div>
    </Form>
  );
}

export default Login;