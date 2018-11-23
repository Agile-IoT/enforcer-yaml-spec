Extend the user inside configure_on_boot with this array


"user": [{
      "user_name": "bob",
      "auth_type": "agile-local",
      "role": "admin",
      "password": "secret"
     },{
      "user_name": "agile",
      "auth_type": "agile-local",
      "role": "admin",
      "password": "secret",
      "credentials": {
        "xively": {
          "xivelymaster": "NU9grueAtYdQE0L7DdFlID3NBZuQn7tyyNvjXUvqoQnJ2rox",
          "xivelyproduct": "Y1o-jUXIj66T1Ekb_Tjx",
          "xivelysecret": "067d1c0ad522fa0315782888b4cf89741b0369ec"
        }
      }
    }],

