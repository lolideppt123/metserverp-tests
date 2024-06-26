import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { Spin, Flex } from 'antd';

import MoneyFormatter, { NumberFormatter } from '../../settings/MoneyFormatter';

export default function MaterialInventoryDataTable({ config }) {
    const { dataTableColumn, data, loading } = config;
    return (
        <div className="contianer">
            {loading ? (
                <div className="py-5">
                    <Flex vertical>
                        <Spin />
                    </Flex>
                </div>
            ) : (
                <>
                    {!data?.length ? (
                        <div className="py-4">
                            <h6 className="text-center px-3 mt-4 mb-1"><i>Nothing to display yet</i></h6>
                        </div>
                    ) : (
                        <div className="app-table">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        {dataTableColumn.map((value) => (
                                            <th className='text-center' key={value.key}>{value.title}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((item, index) => (
                                        <tr key={index}>
                                            <td className='text-center'>{(moment(item.last_ordered_date)).format("MMM DD, YYYY")}</td>
                                            <td className='col col-lg-3 text-center'><NavLink to={`transaction/${item.material_name}`}>{item.material_name}</NavLink> </td>
                                            {/* <td><NumberFormatter amount={item.total_inventory} /></td> */}
                                            <td className='col col-lg-2'>
                                                <div className="progress" style={{ height: "20px", border: "1px solid grey" }}>
                                                    <div className={`progress-bar bg-${item.color} bg-gradient`} role="progressbar" style={{ width: item.width }}>
                                                        <span><NumberFormatter amount={item.total_inventory} /></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-center'><MoneyFormatter amount={item.unit_price} /> | {item.stock_left}</td>
                                            <td className='text-center'>{item.material_unit}</td>
                                            <td className='text-center'>{(moment(item.order_update)).format("MMM DD, YYYY")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
