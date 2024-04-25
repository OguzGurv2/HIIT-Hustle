-- EXERCISES TABLE:

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(20) NOT NULL,
  body_part VARCHAR(30) NOT NULL,
  url VARCHAR(40) NOT NULL,
  duration INT NOT NULL,
  description TEXT NOT NULL
);

-- WORKOUTS TABLE:

CREATE TABLE IF NOT EXISTS workouts (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(15) NOT NULL,
  exercise_list TEXT, 
  rest_time_list TEXT,
  times_finished INTEGER, 
  is_deleted INTEGER NOT NULL,
  FOREIGN KEY (exercise_list) REFERENCES exercises(exercise_id)
);

-- EXERCISES DATA:

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  ( 
    "burpees",
    "Full Body",
    "contents/gifs/burpees.gif",
    30,
    "1. Move into a squat position with your hands on the ground. 2. Kick your feet back into an extended plank position, while keeping your arms extended. 3. Immediately return your feet into squat position. 4. Stand up from the squat position."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "jumping-jacks",
    "Full Body",
    "contents/gifs/jumping-jacks.gif",
    45,
    "1. Stand straight with your feet together and hands by your sides. 2. Jump up, spread your feet and bring both hands together above your head. 3. Jump again and return to the starting position. 4. Repeat until the set is complete."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "squat-jumps",
    "Butt/Hips, Legs/Thighs",
    "contents/gifs/squat-jumps.gif",
    40,
    "1. Stand with feet shoulder width and knees slightly bent. 2. Bend your knees and descend to a full squat position. 3. Engage through the quads, glutes, and hamstrings and propel the body up and off the floor, extending through the legs. With the legs fully extended, the feet will be a few inches (or more) off the floor. 4. Descend and control your landing by going through your foot (toes, ball, arches, heel) and descend into the squat again for another explosive jump. 5. Upon landing immediately repeat the next jump."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "mountain-climbers",
    "Butt/Hips, Full Body, Legs/Thighs",
    "contents/gifs/mountain-climbers.gif",
    30,
    "1. Start in a press-up position, hands wide. 2. Engage your abs and bring your right knee to your chest. As you push the leg back to start position, bring your left knee in. 3. Continue, alternating legs."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "high-knees",
    "Butt/Hips, Arms, Legs/Thighs",
    "contents/gifs/high-knees.gif",
    40,
    "1. Stand straight with your feet shoulder-width apart. Face forward and open your chest. 2. Bring your knees up to waist level and then slowly land on the balls of your feet. 3. Repeat until the set is complete."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "jumping-lunges",
    "Butt/Hips, Legs/Thighs",
    "contents/gifs/jumping-lunges.gif",
    35,
    "1. Take a large step backward and lower your hips, so that your back knee is just above the floor, and your front thigh is parallel to the floor. 2. Jump into the air and switch leg positions. 3. Jump again and return to the starting position. 4. Repeat the exercise until set is complete."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "plank-jacks",
    "Butt/Hips, Legs/Thighs",
    "contents/gifs/plank-jacks.gif",
    30,
    "1. Start in a push up position with your feet together. 2. Hop your feet as far as you can and land softly on your toes. 3. Jump again to bring your feet back together and repeat."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "box-jumps",
    "Butt/Hips, Calves and Shins, Legs/Thighs",
    "contents/gifs/box-jumps.gif",
    40,
    "1. Facing the box with your feet shoulder width apart, bend your knees and push your hips back in a hinge motion. 2. Propel yourself into a jump using the balls of your feet as your base, swinging your arms forward to launch yourself onto the top of the box. 3. Land on the box gently, with your body and feet in their original position—knees bent, hips back. 4. Jump off the box if you are an expert, or simply step off of it if you are still learning."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "bicycle-crunches",
    "Butt/Hips, Chest, Legs/Thighs",
    "contents/gifs/bicycle-crunches.gif",
    30,
    "1. Lie on your back, lift your shoulders off the mat and raise both legs. 2. Bring one knee and the opposing elbow close to each other by crunching to one side, and fully extend the other leg. 3. Return to the starting position and then crunch to the opposite side. 4. Repeat until the set is complete."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "battling-ropes",
    "Full Body",
    "contents/gifs/battling-ropes.gif",
    45,
    "1. Grip the ropes handles, with your thumb sitting on the rope itself as if you were giving yourself a thumbs up. 2. Bend your knees and get in a quarter squat position, ensuring your spine is neutral. 3. Begin flicking the ropes in alternating waves, keeping your elbows tucked in. 4. Continue sending waves through the ropes for 30 seconds, or until failure."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "jump-rope",
    "Butt/Hips, Legs/Thighs",
    "contents/gifs/jump-rope.gif",
    60,
    "1. Hold the rope while keeping your hands at hip level. 2. Rotate your wrists to swing the rope and jump. 3. Jump with both feet at the same time, one foot at a time, alternating between feet, etc. 4. Repeat until the set is complete."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "medicine-ball-slams",
    "Full Body",
    "contents/gifs/medicine-ball-slams.gif",
    30,
    "1. Stand with your feet hip-width apart, your knees slightly bent, and lift a medicine ball up and over your head. 2. Circle the medicine ball around your head and to the left, for 30 seconds. 3. Repeat, circling the medicine ball to the right."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "skater-jumps",
    "Legs/Thighs",
    "contents/gifs/skater-jumps.gif",
    40,
    "1. Lean forward, jump to the right, bring your left foot behind you, and bring your left arm in front of you. 2. Jump to the left, bring your right arm in front of you and your right foot behind you. 3. Repeat this side-to-side movement until the set is complete."
  );

INSERT INTO
  exercises (
    name,
    body_part,
    url,
    duration,
    description
  )
VALUES
  (
    "plyometric-pushups",
    "Chest",
    "contents/gifs/plyometric-pushups.gif",
    30,
    "1. Assume a standard push-up position with your hands shoulder with apart. Hands should be position under your shoulders on the floor. 2. Begin exercise by bending at the elbows and lowering your body to the ground, while keeping your body in a straight line. 3. Next, explode up from the down position and push yourself off the ground so that your hands leave the floor. 4. Drop back down onto your hands and immediately lower back down into the next push-up."
  );
  