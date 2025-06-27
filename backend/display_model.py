'''import pandas as pd

# Load your dataset (change the file name and path as needed)
# df = pd.read_csv('your_dataset.csv')
# or for Excel: df = pd.read_excel('your_dataset.xlsx')
df = pd.read_csv('model/dataset.csv')  # Example

# Ensure all necessary columns exist
exercise_columns = ['exercise1', 'exercise2', 'exercise3', 'exercise4', 'exercise5', 'maintype']
if not all(col in df.columns for col in exercise_columns):
    raise ValueError("Dataset missing required columns.")

# Store seen exercises to avoid duplicates
seen = set()
results = []

# Iterate row by row
for _, row in df.iterrows():
    main_type = row['maintype']
    for col in ['exercise1', 'exercise2', 'exercise3', 'exercise4', 'exercise5']:
        if main_type == "Yoga":
            exercise = row[col]
            if exercise not in seen:
                seen.add(exercise)
                results.append({'exercise': exercise, 'maintype': main_type})

# Convert results to DataFrame and display
unique_exercises_df = pd.DataFrame(results)
print(len(results))
for i in range(len(results)):
    print(results[i]['exercise'])

# Optional: Save to CSV
# unique_exercises_df.to_csv('unique_exercises_by_type.csv', index=False)
'''


'''
lines = [line.strip() for line in data.strip().split('\n') if line.strip()]
seen = set()
unique_ordered = []
csv_output = []

for line in lines:
    if line not in seen:
        seen.add(line)
        unique_ordered.append(line)

# Generate comma-separated string
for i in unique_ordered:
    csv_output.append(i)
'''


data = ['Extended Side Angle', 'Half-Moon', 'Low Lunge', 'Puppy Pose', 'Chair Pose', '', 'Locust Pose', 'Bound Angle', 'Sphinx Pose', 'Gate Pose', 'Cow Face Pose', 'Fish Pose', 'Sun Salutation A', 'Chaturanga', 'Chair Twist', 'Sun Salutation B', 'Crescent Lunge', 'Side Plank', 'Wild Thing', 'Low Lunge Twist', 'High Plank', 'Yogi Push-up', 'Floating Cobra', 'Half-Splits', 'Lizard Pose', 'Core Plank Taps', 'Pyramid Pose', 'Standing Splits', 'Bakasana Prep', 'Side Angle', 'Boat Pose', 'Sun A Series', 'Sun B Series', 'Standing Sequence', 'Back-Bending', 'Marichyasana C', 'Bujapidasana', 'Supta Kurmasana', 'Garbha Pindasana', 'Setu Bandhasana', 'Utthita Hasta Padangusthasana', 'Paschimottanasana', 'Upavishta Konasana', 'Baddha Konasana', 'Shoulder Stand', 'Vinyasa Jump-Back', 'Half Bound Lotus', 'Supta Konasana', 'Tittibhasana', 'Headstand', 'Virabhadrasana B', 'Dandasana', 'Purvottanasana', 'Kukkutasana', 'Ottega Roll', 'Butterfly Pose', 'Dragon Pose', 'Melting Heart', 'Half Butterfly', 'Deer Pose', 'Saddle Pose', 'Seal Pose', 'Square Pose', 'Supported Fish', 'Happy Baby', 'Reclined Twist', 'Caterpillar', 'Legs Up Wall', 'Shoelace Pose', 'Dragonfly', 'Sphinx Twist', 'Half Saddle', 'Frog Pose', 'Banana Pose', 'Wide-Knee Child', 'Toe Squat', 'Reclined Butterfly', 'Sleeping Swan', 'Supported Child', 'Cushioned Savasana', 'Reclined Bound Angle', 'Pillow Twist', 'Bolster Heart Opener', 'Supported Bridge', 'Gentle Fish', 'Side-Lying Savasana', 'Reclined Hero', 'Supported Twist', 'Wall-Supported Butterfly', 'Blanket Roll Spine', 'Bolster Under Knees', 'Lying Butterfly', 'Easy Supported Backbend', 'Eyes-Covered Savasana', 'Supported Puppy', 'Gentle Happy Baby', 'Bolster Child', 'Ribbon Shoulder Opener', 'Bolster-Supported Lizard', 'Power Vinyasa Flow', 'Chaturanga Push-ups', 'Jump Switch Lunge', 'Handstand Hops', 'Dolphin Push-ups', 'Chair Pose Pulses', 'Crow Pose', 'Hollow Body Holds', 'Push-up to Side Plank', 'Pistol Squat Prep', 'Half Moon Pulse', 'Lunge Jumps', 'Core Mountain Climbers', 'Plank Jack Flow', 'Corkscrew Lunge', 'Power Chair Jump', 'Dragon Squat', 'Inverted V Press', 'Power Skandasana', 'Side Crow', 'Wild Thing Crunches', 'Chaturanga Holds', 'Revolved Half-Moon', 'Crescent Twist', 'Reclined Big-Toe Pose', 'Hero Pose', 'Revolved Chair', 'Circle Lunge', 'Half-Camel', 'Prasarita Twist', 'Dancing Shiva', 'Low Lunge Quad Stretch', 'Crocodile Pose', 'Cow Face Arms', 'Reclined Pigeon', 'Reclined Twist-Bind', 'Half-Frog', 'Revolved Triangle Bind', 'Boat Prep', 'Eagle Pose', 'Standing Hand-Clasp Backbend', 'Side Plank Knee-Lift', 'Archer Pose', 'Half-Moon Chapasana', 'Side Plank Star', 'Wild Thing Flip', 'Low Lunge Pulse', 'Tabletop Kick-Through', 'Crescent Knee Tap', 'Runner’s Lunge Twist', 'Standing Split Pulse', 'Low Skandasana Flow', 'Horizon Lunge', 'Reverse Table Dip', 'Dolphin Flow', 'Crescent Airplane Arms', 'Three-Leg Chaturanga', 'Knee-to-Nose Flow', 'Chair Heel Lift', 'Plank Toe-Tap', 'Hovering Cobra', 'Side Lunge Fly', 'Wide-Leg Flow', 'Half-Split Pulse', 'Intermediate Series Prep', 'Pincha Mayurasana', 'Karandavasana', 'Leg-Behind-Head Entry', 'Drop-back Bridge', 'Handstand Tuck', 'Janu Sirsasana C', 'Supta Trivikramasana', 'Visvamitrasana', 'Bound Headstand', 'Tittibhasana B', 'Bhurangasana', 'Upward Lotus', 'Parsva Dhanurasana', 'Ganda Bherundasana', 'Navasana Hold', 'Half-Lotus Rising', 'Marichyasana D', 'Rolling Vinyasa', 'Chin-Stand', 'Purna Matsyendrasana', 'Handstand Press', 'Parivritta Parsvakonasana', 'Lotus Jump-Back', 'Bhairavasana', 'Dragonfly Twist', 'Snail Pose', 'Hammock Pose', 'Broken Wing', 'Supported Saddle', 'Seal Twist', 'Pentacle Pose', 'Hip-Side Lying Fix', 'Banana Saddle', 'Swirl Pose', 'Supported Sphinx', 'Dragon Side Bend', 'Supine Deer', 'Pigeon Sleeping', 'Melting Heart Twist', 'Half-Shoelace', 'Bridge Butterfly', 'Supported Frog', 'Rag Doll Drape', 'Supported Plow', 'Reclined Dragonfly', 'Yin Camel', 'Toe Stretch', 'Compass Support', 'Bolster Twist Arch', 'Supported Lizard', 'Blanket Butterfly', 'Low-Back Cradle', 'Supported Gate Pose', 'Elevated Legs Cradle', 'Bolster-Held Heart', 'Sandbag Belly Rest', 'Side-Body Stretch', 'Bolster-Supported Child', 'Lying Crescent', 'Rest-Seat Pose', 'Bolster-Egg Pose', 'Pillow-Knees Hug', 'Wall Puppy Support', 'Savasana with Sandbag', 'Blanket-Roll Bridge', 'Side-Savasana Curl', 'Bolster-Under-Shoulder Fish', 'Supported Bound Angle', 'Eye-Pillow Savasana', 'Knee-Support Twist', 'Bolster-Mountain', 'Double-Knee Drive Plank', 'Handstand Wall-Kick', 'Jump-Switch Crescent', 'Power Skater Lunge', 'Boat V-Up', 'Core Bear Hover', 'Push-Up to Side-Crow', 'Explosive Chair Jump', 'Crow to Tripod Headstand', 'L-Sit Arm Lift', 'Chaturanga Push-Clap', 'Runner’s Jump Switch', 'Hovering Dolphin', 'Dragon Hop Squat', 'Suspended Split Pulse', 'Bound Side Plank', 'Forearm Stand Kick', 'Power Half-Moon', 'Jump-Switch Skandasana', 'Inversion Pike Press', 'Corkscrew Push-up', 'Plank Jack Push', 'Power Boat Twist']

j = 0
for i in data:

    if "Dog" in i:
        data.remove(i)
    elif "Warrior" in i:
        data.remove(i)
    elif "Seated" in i:
        data.remove(i)
    elif "Forward" in i:
        data.remove(i)
    elif "Fold" in i:
        data.remove(i)
    j=j+1

print(data)


'''
fitness = [Burpees,Jumping,Climbers,Knees,Curls,Tricep,Push-ups,Shoulder,Squats,Lunges,Deadlifts,Raises,Bridges,Thrusters,
Kettlebell,Rowing,Box Jumps,Wall Sit,Man Makers,Tire Flips,]

meditation = [Body Scan,Box Breathing,Progressive Muscle Relaxation,Guided Imagery,Sunlight Meditation,Metta Chant,
Rainfall Focus,Butterfly Hug,Emotion Labeling]

yoga = [Mountain Pose,Tree Pose,Bridge Pose,Cobra Pose,Triangle PoseChild’s Pose,Camel Pose,Downward Dog,Warrior,
Seated Forward Fold,Revolved Triangle,Half-Moon]
'''