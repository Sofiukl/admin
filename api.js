const admin = require("firebase-admin");

async function listUsers(request, response) {
  try {
    const userResponse = await admin.auth().listUsers();

    const users = [];
    userResponse.users.forEach((userRecord) => {
      console.log(userRecord);
      users.push({
        uid: userRecord.uid,
        displayName: userRecord.displayName,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        phoneNumber: userRecord.phoneNumber,
        metadata: userRecord.metadata,
      });
    });

    return response.send({
      error: false,
      message: "Fetched users",
      result: users,
    });
  } catch (error) {
    console.log("Error fetching user data:", error);

    response.status(500);
    return response.send({
      error: true,
      message: "Internal error occurred.",
      result: [],
    });
  }
}

async function createUser(request, response) {
  try {
    const user = request.body;

    await admin.auth().createUser(user);

    return response.send({
      error: false,
      message: "User create successfull",
      result: [],
    });
  } catch (error) {
    console.log("Error creating new user:", error);
    response.status(500);
    return response.send({
      error: true,
      message: "Internal error occurred.",
      result: [],
    });
  }
}

async function deleteUser(request, response) {
  try {
    const uid = request.params.uid;

    await admin.auth().deleteUser(uid);

    return response.send({
      error: false,
      message: "User delete successfull",
      result: [],
    });
  } catch (error) {
    console.log("Successfully deleted user");
    response.status(500);
    return response.send({
      error: true,
      message: "Internal error occurred.",
      result: [],
    });
  }
}

module.exports = {
  listUsers,
  createUser,
  deleteUser
};
