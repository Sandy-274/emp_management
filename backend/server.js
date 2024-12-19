const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

app.use(cors());
app.use(express.json());

app.post('/addEmployee', async(req,res) => {

    const {name,emp_id,email,phonenum,dept,doj,role}= req.body;
    const errors = {};

    if (!name) errors.name = 'Name is required';
    if (!emp_id) errors.emp_id = 'Employee ID is required';
    if (!email) errors.email = 'Email is required';
    else if (!emailRegex.test(email)) errors.email = 'Invalid email format';

    if (!phonenum) errors.phonenum = 'Phone number is required';
    else if (phonenum.length !== 10) errors.phonenum = 'Phone number must be 10 digits';

    if (!dept) errors.dept = 'Department is required';
    if (!doj) errors.doj = 'Date of joining is required';
    if (!role) errors.role = 'Role is required';

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    try{
        const checkEmployee=await pool.query('SELECT * from employees WHERE emp_id=$1 OR email=$2',[emp_id,email]);
        if(checkEmployee.rows.length>0){
            return res.status(400).json({message:'Employee ID/Email already exists'});
        }

        const result=await pool.query(
            'INSERT INTO employees (name,emp_id,email,phonenum,dept,doj,role) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [name,emp_id,email,phonenum,dept,doj,role]
        );
        res.status(201).json({message:'Employee added successfully',employee: result.rows[0]});
    }catch(error){
        console.error("Error in route:",error);
        res.status(500).json({message:'Server error'});
    }

    });

app.listen(5000,()=>{
    console.log("Server is running at port 5000");
});