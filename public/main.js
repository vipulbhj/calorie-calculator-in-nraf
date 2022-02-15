window.onload = function () {
  const loginFormElem = document.getElementById("login");
  const signupFormElem = document.getElementById("signup");
  const addIntakeFormElem = document.getElementById("addIntake");
  const deleteIntakeButtonElems =
    document.getElementsByClassName("deleteIntakeButton");
  const editIntakeFormElem = document.getElementById("editIntake");
  const inviteFormElem = document.getElementById("inviteForm");
  const inviteFormSubmitButtonElem =
    document.getElementById("inviteSubmitButton");

  const foodItemNameInputElem = document.getElementById("foodItemNameInput");
  const foodItemCalorieInputElem = document.getElementById(
    "foodItemCalorieInput"
  );

  signupFormElem?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(signupFormElem);
    const data = JSON.stringify(Object.fromEntries(formData));

    const res = await fetch("/signup", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();

    if (resJSON?.status === "error") {
      alert(resJSON?.message);
    }

    window.location = "/login";
  });

  loginFormElem?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginFormElem);
    const data = JSON.stringify(Object.fromEntries(formData));

    const res = await fetch("/login", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();

    if (resJSON?.status === "error" || !resJSON?.token) {
      return alert(resJSON?.message);
    }

    localStorage.setItem("token", resJSON.token);
    window.location = "/";
  });

  addIntakeFormElem?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addIntakeFormElem);
    const data = Object.fromEntries(formData);

    const res = await fetch("/intake/create", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        token: localStorage.getItem("token"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();

    if (resJSON?.status === "error") {
      return alert(resJSON?.message);
    }

    window.location = "/";
  });

  editIntakeFormElem?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editIntakeFormElem);
    const data = Object.fromEntries(formData);

    const res = await fetch(`/admin/intake/${data.intakeId}/update`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        token: localStorage.getItem("token"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();

    if (resJSON?.status === "error") {
      return alert(resJSON?.message);
    }

    window.location = "/admin/";
  });

  deleteIntakeButtonElems &&
    Array.from(deleteIntakeButtonElems).forEach((deleteIntakeButtonElem) => {
      deleteIntakeButtonElem?.addEventListener("click", async (e) => {
        e.preventDefault();

        const intakeId = e.target.dataset.intakeId;

        const res = await fetch(`/admin/intake/${intakeId}/delete`, {
          method: "POST",
        });

        const resJSON = await res.json();

        if (resJSON?.status === "error") {
          return alert(resJSON?.message);
        }

        window.location = "/admin/";
      });
    });

  inviteFormSubmitButtonElem?.addEventListener("click", async (e) => {
    e.preventDefault();
    const bootstrapModal = bootstrap.Modal.getInstance(
      document.getElementById("inviteModal")
    );

    const formData = new FormData(inviteFormElem);
    const pass = genRandomStr(8);

    const data = Object.assign(
      { password: pass },
      Object.fromEntries(formData)
    );

    bootstrapModal.hide();

    const res = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();

    if (resJSON?.status === "error") {
      return alert(resJSON?.message);
    }

    alert(
      `User Created with, email ${data.email} and password ${data.password}`
    );
  });

  foodItemNameInputElem?.addEventListener("focusout", async (e) => {
    e.preventDefault();

    const foodQuery = e.target.value;

    if (foodQuery && foodQuery.length !== 0) {
      const caloricVal = await findCalories(foodQuery);
      if (caloricVal) {
        foodItemCalorieInputElem.value = caloricVal;
      } else {
        console.error(caloricVal);
      }
    }
  });
};

function genRandomStr(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function findCalories(food) {
  const NutritionixAppID = "yourAppID";
  const NutritionixAppKey = "yourAPIKey";

  try {
    const res = await fetch(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        method: "POST",
        body: JSON.stringify({
          query: food,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-app-id": NutritionixAppID,
          "x-app-key": NutritionixAppKey,
        },
      }
    );

    const json = await res.json();

    const foods = json?.foods;
    const caloricVal = foods.reduce((acc, item) => {
      return acc + item?.nf_calories;
    }, 0);

    return caloricVal;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
