const { users: User } = require("../models/getModels");

const checkUserCreation = async () => {
  const user = await User.create({
    email: "anas@email.com",
    password: "password",
    full_name: "Anas Mohsen",
    role: "admin",
  });

  console.log(
    (await user.comparePassword("password"))
      ? "password matched"
      : "invalid password"
  );
};

const checkUserJWT = async () => {
  const user = await User.findOne({ where: { user_id: 1 } });

  console.log(
    (await user.comparePassword("password"))
      ? "password matched"
      : "invalid password"
  );
  console.log(await user.getJwtToken());
};

const checkUserResetToken = async () => {
  const user = await User.findOne({
    where: { user_id: 1 },
    attributes: { include: ["password"] },
  });

  console.log(user);

  console.log(
    (await user.comparePassword("password"))
      ? "password matched"
      : "invalid password"
  );
  console.log(await user.getResetPasswordToken());
};

checkUserCreation();
// checkUserJWT();
// checkUserResetToken();
