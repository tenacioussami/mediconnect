export const doctors = [
  { id: 'D001', name: 'Dr. Ayesha Rahman', specialty: 'Cardiology', experience: '12 years', fee: 800, rating: 4.9, available: true, img: null, hospital: 'Dhaka Medical Center', phone: '01887654321', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'] },
  { id: 'D002', name: 'Dr. Tanvir Ahmed', specialty: 'Neurology', experience: '8 years', fee: 1000, rating: 4.7, available: true, img: null, hospital: 'Square Hospital', phone: '01799887766', slots: ['10:30 AM', '12:00 PM', '3:00 PM'] },
  { id: 'D003', name: 'Dr. Nusrat Jahan', specialty: 'Dermatology', experience: '6 years', fee: 600, rating: 4.8, available: false, img: null, hospital: 'Popular Diagnostic', phone: '01611223344', slots: ['9:30 AM', '11:00 AM'] },
  { id: 'D004', name: 'Dr. Kamrul Islam', specialty: 'Orthopedics', experience: '15 years', fee: 1200, rating: 4.6, available: true, img: null, hospital: 'Ibn Sina Hospital', phone: '01511223344', slots: ['8:00 AM', '1:00 PM', '5:00 PM'] },
  { id: 'D005', name: 'Dr. Farida Begum', specialty: 'Pediatrics', experience: '10 years', fee: 700, rating: 4.9, available: true, img: null, hospital: 'Shishu Hospital', phone: '01922334455', slots: ['9:00 AM', '11:00 AM', '3:30 PM'] },
  { id: 'D006', name: 'Dr. Rezaul Karim', specialty: 'General Medicine', experience: '5 years', fee: 500, rating: 4.5, available: true, img: null, hospital: 'City Health Clinic', phone: '01833445566', slots: ['10:00 AM', '12:30 PM', '4:30 PM'] },
]

export const appointments = [
  { id: 'APT001', patientId: 'P001', doctorId: 'D001', doctorName: 'Dr. Ayesha Rahman', specialty: 'Cardiology', date: '2026-04-20', time: '10:00 AM', type: 'Online', status: 'Confirmed', fee: 800 },
  { id: 'APT002', patientId: 'P001', doctorId: 'D002', doctorName: 'Dr. Tanvir Ahmed', specialty: 'Neurology', date: '2026-04-18', time: '3:00 PM', type: 'Offline', status: 'Completed', fee: 1000 },
  { id: 'APT003', patientId: 'P001', doctorId: 'D005', doctorName: 'Dr. Farida Begum', specialty: 'Pediatrics', date: '2026-04-25', time: '9:00 AM', type: 'Online', status: 'Pending', fee: 700 },
]

export const prescriptions = [
  { id: 'PRX001', doctorName: 'Dr. Ayesha Rahman', date: '2026-04-18', diagnosis: 'Hypertension Stage 1', medicines: [
    { name: 'Amlodipine 5mg', dose: '1 tablet daily', duration: '30 days' },
    { name: 'Losartan 50mg', dose: '1 tablet morning', duration: '30 days' },
  ], note: 'Avoid salty foods. Regular BP monitoring.', followUp: '2026-05-18' },
  { id: 'PRX002', doctorName: 'Dr. Tanvir Ahmed', date: '2026-04-10', diagnosis: 'Migraine', medicines: [
    { name: 'Sumatriptan 50mg', dose: '1 tablet when needed', duration: '15 days' },
    { name: 'Propranolol 20mg', dose: '1 tablet twice daily', duration: '30 days' },
  ], note: 'Rest in dark room during attacks. Stay hydrated.', followUp: '2026-05-10' },
]

export const testReports = [
  { id: 'TST001', testName: 'Complete Blood Count (CBC)', requestedBy: 'Dr. Ayesha Rahman', requestDate: '2026-04-15', status: 'Completed', reportUrl: '#', results: { Hemoglobin: '13.5 g/dL', WBC: '7,500/μL', Platelets: '250,000/μL', RBC: '4.8 M/μL' } },
  { id: 'TST002', testName: 'Chest X-Ray', requestedBy: 'Dr. Tanvir Ahmed', requestDate: '2026-04-16', status: 'In Progress', reportUrl: null },
  { id: 'TST003', testName: 'MRI Brain', requestedBy: 'Dr. Tanvir Ahmed', requestDate: '2026-04-17', status: 'Pending', reportUrl: null },
]

export const symptoms = [
  'Fever', 'Headache', 'Cough', 'Chest Pain', 'Shortness of Breath',
  'Fatigue', 'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain',
  'Back Pain', 'Joint Pain', 'Skin Rash', 'Dizziness', 'Sore Throat',
  'Runny Nose', 'Loss of Appetite', 'Weight Loss', 'Swelling', 'Blurred Vision'
]

export const symptomPredictions = {
  'Fever,Cough,Sore Throat': { disease: 'Upper Respiratory Infection', severity: 'Mild', specialist: 'General Medicine', advice: 'Rest, stay hydrated, and take paracetamol for fever.' },
  'Chest Pain,Shortness of Breath': { disease: 'Possible Cardiac Issue', severity: 'High', specialist: 'Cardiology', advice: 'Seek immediate medical attention. Avoid physical exertion.' },
  'Headache,Dizziness,Blurred Vision': { disease: 'Possible Hypertension / Migraine', severity: 'Moderate', specialist: 'Neurology', advice: 'Monitor BP regularly. Rest in a quiet, dark room.' },
  'Nausea,Vomiting,Abdominal Pain': { disease: 'Gastroenteritis', severity: 'Mild', specialist: 'General Medicine', advice: 'ORS fluids, bland diet, avoid dairy.' },
  'Joint Pain,Swelling,Fatigue': { disease: 'Possible Rheumatoid Arthritis', severity: 'Moderate', specialist: 'Orthopedics', advice: 'Anti-inflammatory medication. Consult orthopedic specialist.' },
  'Skin Rash': { disease: 'Allergic Reaction / Dermatitis', severity: 'Mild', specialist: 'Dermatology', advice: 'Antihistamines, avoid triggers. Topical creams.' },
}

export const adminStats = {
  totalPatients: 1248,
  totalDoctors: 42,
  appointmentsToday: 87,
  revenue: 128500,
  pendingTests: 15,
  onlineConsultations: 34,
}
