import {Button, Form, Input} from "antd";
import {Dispatch, useEffect, useState} from "react";
import "firebase/compat/auth";
import {useAuth} from "../../contexts/AuthContext";

interface IRegisterProps {
  setLoginType: Dispatch<number>
}

interface IForm {
  email: string;
  password: string;
}

export default function Register({setLoginType}: IRegisterProps) {
  const {register} = useAuth();

  const [form] = Form.useForm<IForm>();
  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values: IForm) => register(values.email, values.password);

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
            data-testid="register-submit-button"
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({errors}) => errors.length).length
            }
          >
            Register
          </Button>
        )}
      </Form.Item>
      <div>
        Or
        <Button
          data-testid="or-login-button"
          type="text"
          htmlType="button"
          onClick={() => setLoginType(1)}
        >
          Login
        </Button>
      </div>
    </Form>
  );
}