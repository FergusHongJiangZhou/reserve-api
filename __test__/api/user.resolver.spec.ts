import { connectToDB, disconnectDB, cleanDB } from "../db";
import { runQuery } from "../run";

describe("Register Mutation", () => {
  beforeAll(connectToDB);
  afterAll(cleanDB);
  afterAll(disconnectDB);

  const registerMutation = `
  mutation Register($name: String!,$phone : String!,$password : String!) {
    addUser(
        UserInput: {name : $name,phone : $phone,password: $password}
    ) {
        name
        phone
    }
  }
  `;
  it("run successfully", async () => {
    const user = {
      name: "test",
      phone: "1233454",
      password: "123456",
    };
    const response = await runQuery(registerMutation, {
      name: user.name,
      phone: user.phone,
      password: user.password,
    });
    expect(response).toMatchObject({
      data: {
        addUser: {
          name: user.name,
          phone: user.phone,
        },
      },
    });
  });
});
