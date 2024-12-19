import './App.css';
import {useState} from 'react';

function App() {

  const [formData,setFormData] = useState({
    name:'',
    emp_id:'',
    email:'',
    phonenum:'',
    dept:'',
    doj:'',
    role:''
  });

  const [errors,setErrors]=useState({});
  const [success,setSuccess]=useState('');
  const now = new Date().toISOString().split("T")[0];

  const depts=["HR","Engineering","Marketing","Production","Development"];

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }

  const handleReset = () =>{
    setFormData({
      name:'',
      emp_id:'',
      email:'',
      phonenum:'',
      dept:'',
      doj:'',
      role:''
    })
    setErrors({});
    setSuccess('');
  }

  const handleSubmit = async(e) =>{
    setErrors({});
    setSuccess('');
    e.preventDefault();

    let newErrors={};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.emp_id) newErrors.emp_id = 'Employee ID is required';
    if (!formData.email) newErrors.email = 'Email ID is required';
    if (!formData.phonenum) newErrors.phonenum = 'Phone number is required';
    if (!formData.dept) newErrors.dept = 'Department is required';
    if (!formData.doj) newErrors.doj = 'Date of Joining is required';
    if (!formData.role) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.status === 201) {
        setSuccess(result.message);
        setErrors({});
        setFormData({
          name: '',
          emp_id: '',
          email: '',
          phonenum: '',
          dept: '',
          doj: '',
          role: '',
        });
      } else if (response.status === 400) {
        if (result.errors) {
          setErrors(result.errors); 
        } else {
          setErrors({ server: 'Failed to add employee / Already exists' });
        }
        setSuccess('');
      } else {
        setErrors({ server: 'Something went wrong' });
        setSuccess('');
      }
    } catch (error) {
      setErrors({ server: 'Error connecting to server' });
      setSuccess('');
    }
  };

  return (
    <div className="App">
      <h1>Employee Management System</h1>
      <form className='form-container' onSubmit={handleSubmit}>

      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Enter Name' required />
        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
      </div>

      <div className='form-group'>
        <label htmlFor='emp_id'>Employee ID</label>
        <input type="text" name="emp_id" value={formData.emp_id} onChange={handleChange} placeholder='Employee ID (eg. A12D)' required />
        {errors.emp_id && <div style={{ color: 'red' }}>{errors.emp_id}</div>}
      </div>

      <div className='form-group'>
        <label htmlFor='email'>Email ID</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='Enter valid email' required />
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
      </div>

      <div className='form-group'>
        <label htmlFor='phonenum'>Phone Number</label>
        <input type="number" name="phonenum" value={formData.phonenum} onChange={handleChange} placeholder='Enter valid 10 digit number' min="1000000000" max="9999999999" required />
        {errors.phonenum && <div style={{ color: 'red' }}>{errors.phonenum}</div>}
      </div>

      <div className='form-group'>
        <label htmlFor='dept'>Department</label>
        <select name="dept" value={formData.dept} onChange={handleChange}>
            <option value="">Select Department</option>
            {depts.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
        </select>
        {errors.dept && <div style={{ color: 'red' }}>{errors.dept}</div>}
      </div>

      <div className='form-group'>
          <label htmlFor='doj'>Date of Joining</label>
          <input type="date" name="doj" value={formData.doj} onChange={handleChange} max={now} required/>
          {errors.doj && <div style={{ color: 'red' }}>{errors.doj}</div>}
        </div>

      <div className='form-group'>
        <label htmlFor='role'>Role</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder='Enter role (eg. Intern)' required />
        {errors.role && <div style={{ color: 'red' }}>{errors.role}</div>}
      </div>

      <button type="submit">Add Employee</button>
      <button type="button" onClick={handleReset}>Reset to Default</button>

      </form>

      {errors.server && <div style={{ color: 'red', marginTop: '10px' }}>{errors.server}</div>}
      {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
    </div>
  );
}
export default App;