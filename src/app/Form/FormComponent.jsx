"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Checkbox, Select } from "antd";
import Image from "next/image";
import Swal from "sweetalert2";
import { useAppSelector, useAppDispatch } from '../../Redux/hooks';
import uploadIcon from "../Assets/Upload-icon.svg";

import { setFormData, setErrors } from "../../Redux/FormSlice"; 

const formSchema = z.object({
  text: z.string().nonempty("Text is required"),
  number: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Please enter number!")
  ),
  password: z.string().min(1, "Password is required!"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  dropdown: z.enum(["Japan", "India", "Turkey", "Dubai", "Other"], {
    errorMap: () => ({ message: "Please select from dropdown!" }),
  }),
  file: z.any().refine((file) => file instanceof File, "File is required"),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
});
const { Option } = Select;

const FormComponent = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.form.formData);
  const errors = useAppSelector((state) => state.form.errors);
  const [filePreview ,setFilePreview] = useState();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = value;
    
    const map = {
      checkbox: newValue = checked,
      file: newValue = files[0],
    };

    if (map[value]) {
      newValue = map[value];
    };
    
    // let newValue;
    // if (type === "checkbox") {
    //   newValue = checked;
    // } else if (type === "file") {
    //   newValue = files[0];
    // } else {
    //   newValue = value;
    // }
  
    dispatch(setFormData({ [name]: newValue }));
  };
  
  useEffect(()=>{
    if(formData.file){
     const fileReader = new FileReader();
     const url = URL.createObjectURL(formData.file);
     setFilePreview(url);
    }
  },[formData.file])

  const handleDropdownChange = (value) => {
    dispatch(setFormData({ dropdown: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (result.success) {
      dispatch(setErrors({}));
      Swal.fire({
        title: "Form Submitted!",
        text: "Your form has been submitted!",
        icon: "success"
      });
    } else {
      const fieldErrors = result.error.format();
      dispatch(setErrors(fieldErrors));
    }
  };  
  const optionArray = ["India" ,"Turkey" ,"Dubai","Others"]; 

   return (
    <div className="flex justify-center items-center min-h-screen w-[100%] bg-[#F8F7FA]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#ffff] p-7 rounded-lg md:w-[85%] lg:w-[60%] xl:w-[60%] font-poppins"
      >
        <h1 className="text-2xl font-bold  text-center font-poppins mb-[20px]">
          Next.js Form with Tailwind CSS and Zod
        </h1>
        <div className="font-poppins flex gap-[20px] w-full mb-4">
          <div className="w-[50%]">
            <label className="block text-sm font-bold mb-2" htmlFor="text">
              Enter Name <sup className="text-[#ff0000] text-[14px]">*</sup>
            </label>
            <input
              type="text"
              name="text"
              placeholder="John Doe"
              value={formData.text}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#6366F1] sm:text-xs sm:leading-6"
            />
            {errors.text && (
              <p className="text-red-500 text-xs italic mt-[5px]">
                {errors.text._errors[0]}
              </p>
            )}
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-bold mb-2" htmlFor="number">
              Number <sup className="text-[#ff0000] text-[14px]">*</sup>
            </label>
            <input
              type="number"
              name="number"
              placeholder="+92 123 21337"
              value={formData.number}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#6366F1] sm:text-xs sm:leading-6"
            />
            {errors.number && (
              <p className="text-red-500 text-xs italic mt-[5px]">
                {errors.number._errors[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-[100%] gap-[20px] mb-4">
          <div className="w-[50%]">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password <sup className="text-[#ff0000] text-[14px]">*</sup>
            </label>
            <input
              type="password"
              name="password"
              placeholder="*********"
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#6366F1] sm:text-xs sm:leading-6"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-[5px]">
                {errors.password._errors[0]}
              </p>
            )}
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-bold mb-2" htmlFor="dropdown">
              Dropdown <sup className="text-[#ff0000] text-[14px]">*</sup>
            </label>
            <Select
              name="dropdown"
              value={formData.dropdown}
              onChange={(e)=>handleDropdownChange(e)}
              className=" w-[100%] h-[36px]"
            >
              {optionArray.map((item,key) =>(<Option value={item} key={key}>{item}</Option>))}
            </Select>
            {errors.dropdown && (
              <p className="text-red-500 text-xs italic mt-[5px]">
                {errors.dropdown._errors[0]}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 " htmlFor="gender">
            Gender <sup className="text-[#ff0000] text-[14px]">*</sup>
          </label>
          <div className="flex items-center">
            <label className="mr-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="mr-1"
              />
              Male
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="mr-1"
              />
              Female
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs italic mt-[5px]">
              {errors.gender._errors[0]}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="file">
            File Upload <sup className="text-[#ff0000] text-[14px]">*</sup>
          </label>
          {formData.file?
          <div className="w-[100%] bg-[#f4f8ff] border-dashed border-[2px]	border-[#3B82F6] rounded-[4px] flex flex-col items-center mt-[6px]">
           <img src={filePreview} alt="" srcSet="" />
          </div>: 
          <div className="w-[100%] bg-[#f4f8ff] border-dashed border-[2px]	border-[#3B82F6] rounded-[4px] flex py-8 flex-col items-center mt-[6px]">
          <Image src={uploadIcon} alt="Upload Icon Here"/>
          <h2 className="font-poppins font-[600] text-[16px] text-[#454545] my-[5px]">
            <label
              htmlFor="file"
              className="text-[#3B82F6] hover:underline cursor-pointer"
            >
              <input
                id="file"
                type="file"
                name="file"
                className="hidden"
                onChange={handleChange}
                accept="JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT"
              />
              Browse 
            </label>
             &nbsp;to upload file
          </h2>
          <p className="font-poppins font-[400] text-[#676767] text-[12px] leading-[18px] text-center">
            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
          </p>
        </div>}
          {errors.file && (
            <p className="text-red-500 text-xs italic mt-[5px]">
              {errors.file._errors[0]}
            </p>
          )}
        </div>
        <div className="mb-4">
          <div className="flex gap-[6px] items-center">
            <Checkbox checked={formData.acceptTerms} onChange={handleChange} name="acceptTerms">Terms & Conditions</Checkbox>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs italic mt-[5px]">
              {errors.acceptTerms._errors[0]}
            </p>
          )}
        </div>
        <div className="mb-4 flex w-[100%] justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;

