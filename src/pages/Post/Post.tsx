import {Button, Form, Input, Layout, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {useEffect} from "react";
import {movieAdd} from "../../services/movie";

interface IForm {
  url: string;
}
export default function Post() {
  const {user, token} = useAuth();

  const [form] = Form.useForm<IForm>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) navigate('/');
  }, [user, token, navigate]);

  const onFinish = async (values: IForm) => {
    movieAdd(values.url, user?.email || '')
      .then(() => navigate('/'))
  };

  return (
    <Layout>
      <h1>Post</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="url"
          label="Youtube URL"
          rules={[{ required: true }, { type: 'url', warningOnly: true }, { type: 'string', min: 6 }]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}