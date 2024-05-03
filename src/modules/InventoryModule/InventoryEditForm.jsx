import { useEffect, useState } from 'react';
import useAxiosFunction from '../../hooks/useAxiosFunction';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Spinner from '../../components/Fallback/Spinner';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { FiPlus } from 'react-icons/fi';

export default function InventoryEditForm({ config }) {
    const { loading, response, success, error, axiosFetch } = useAxiosFunction();
    const {
        Labels,
        id,
        supplier,
        products,
        item,
        supplierLoad,
        productsLoad,
        itemLoad,
    } = config
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        setError: formSetError,
        clearErrors: formClearError,
        setValue,
        getValues,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        defaultValues: {
            inventory_quantity: 0,
            price_per_unit: 0
        }
    });

    const [FormLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (item == null) {
            console.log("item does not exists")
        }
        else {
            // console.log(item);
            [
                { name: 'inventory_product_name', value: item.product_name },
                { name: 'supplier', value: item.supplier },
                { name: 'inventory_quantity', value: parseFloat(item.quantity) },
                { name: 'inventory_stock_left', value: parseFloat(item.product_stock_left) },
                { name: 'price_per_unit', value: parseFloat(item.product_cost) },
                { name: 'total_cost', value: parseFloat(item.product_total_cost) },
                { name: 'ordered_date', value: item.ordered_date },
                { name: 'inventory_note', value: item.inventory_note },
            ].forEach(({ name, value }) => setValue(name, value))

        }
    }, [item])

    const onSubmit = async (data) => {
        setFormLoading(true);
        const configObj = {
            url: `${Labels.API_URL}`,
            method: `${Labels.METHOD}`,
            data: data,
            formSetError: formSetError
        }
        setTimeout(async () => {
            axiosFetch(configObj);
        }, 1500);
    }

    useEffect(() => {
        if (success) {
            setFormLoading(false);
            reset();
            formClearError();
            history.back();
        }
    }, [success])

    return (
        <div className="container">
            {supplierLoad || productsLoad || itemLoad ? (
                <Spinner />
            ) : (
                <>
                    <form id={`add${Labels.PAGE_ENTITY}Form`} onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-5 border-end border-secondary">
                                <div className='form-group mb-2'>
                                    <label htmlFor="ordered_date">Ordered Date</label>
                                    <input type="date" className="form-control form-control-sm" id='ordered_date' {...register("ordered_date", { required: "Date is required" })} disabled />
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor="inventory_product_name" className="text-md text-gray-500">Product Name</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control form-control-sm" disabled {
                                            ...register("inventory_product_name", {
                                                required: "Product Name is required"
                                            }
                                            )} />
                                    </div>
                                    {errors.inventory_product_name && (<p className='text-danger px-1 mt-1 mb-2' style={{ fontWeight: "600", fontSize: "13px" }}>{errors.inventory_product_name.message}</p>)}
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor="supplier" className="text-md text-gray-500">Supplier</label>
                                    <div className="input-group">
                                        <select className="form-select form-select-sm" autoComplete='off' id='supplier' {...register("supplier", { required: "Supplier is required" })} disabled>
                                            <option value="">Choose...</option>
                                            {supplier?.map((item, index) => (
                                                <option key={index} value={item.company_name}>{item.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.supplier && (<p className='text-danger px-1 mt-1 mb-2' style={{ fontWeight: "600", fontSize: "13px" }}>{errors.supplier.message}</p>)}
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor="inventory_quantity">Quantity</label>
                                    <input type="number" className="form-control form-control-sm" id='inventory_quantity' autoComplete='off' min={0} step="0.01" disabled
                                        {
                                        ...register("inventory_quantity", {
                                            required: "Quantity is required",
                                            valueAsNumber: true,
                                        })
                                        } />
                                    {errors.inventory_quantity && (<p className='text-danger px-1 mt-1 mb-2' style={{ fontWeight: "600", fontSize: "13px" }}>{errors.inventory_quantity.message}</p>)}
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor="inventory_stock_left">Stock Left</label>
                                    <input type="number" className="form-control form-control-sm" id='inventory_stock_left' autoComplete='off' min={0} step={0.01} disabled
                                        {
                                        ...register("inventory_stock_left", {
                                            required: "Quantity is required",
                                            valueAsNumber: true,
                                            onChange: (e) => setValue("total_cost", (e.target.value * getValues("price_per_unit"))) // Provides Value to total Cost when change
                                        })
                                        } />
                                    {errors.inventory_stock_left && (<p className='text-danger px-1 mt-1 mb-2' style={{ fontWeight: "600", fontSize: "13px" }}>{errors.inventory_stock_left.message}</p>)}
                                </div>
                                <div className="flex-fill mb-2">
                                    <label htmlFor="price_per_unit">Cost per Unit</label>
                                    <input type="number" className="form-control form-control-sm" id='price_per_unit' autoComplete='off' min={0} step="0.01"
                                        {
                                        ...register("price_per_unit", {
                                            required: "Unit Price is required",
                                            valueAsNumber: true,
                                            onChange: (e) => setValue("total_cost", (e.target.value * getValues("inventory_quantity")).toFixed(2)) // Provides Value to total Cost when change
                                        })
                                        } />
                                </div>
                                <div className="flex-fill mb-2">
                                    <label htmlFor="total_cost">Total Cost</label>
                                    <input type="number" className="form-control form-control-sm" id='total_cost' autoComplete='off' step="0.01" min={0} {...register("total_cost", { required: "Unit Price is required" })} />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="inventory_note">Note</label>
                                    <textarea className="form-control form-control-sm" rows="5" cols="50" style={{ resize: 'none' }} id='inventory_note' {...register("inventory_note")}></textarea>
                                </div>
                            </div>
                            <div className="col-md-7">
                            </div>
                        </div>
                    </form>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 mt-4 border-top">
                        <button type='submit' className='btn btn-primary col-2' form={`add${Labels.PAGE_ENTITY}Form`} disabled={isSubmitting || !isDirty}>
                            {FormLoading ? (
                                <Spin
                                    indicator={
                                        <LoadingOutlined
                                            style={{
                                                fontSize: 18,
                                                color: 'white',
                                                margin: '0 8px 3px 0'
                                            }}
                                            spin
                                        />
                                    }
                                />
                            ) : (
                                <FiPlus style={{ height: '18px', width: '18px', margin: '0 6px 3px 0' }} />
                            )}
                            Save
                        </button>
                        <button type="button" onClick={() => history.back()} className='btn btn btn-outline-secondary'>Cancel</button>
                    </div>
                </>
            )}
        </div >
    )
}
