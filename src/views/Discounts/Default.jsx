import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import MainCard from 'components/MainCard';

export default function Default() {
    return (
        <Row>
            <Col xl={12}>
                <MainCard
                    title="Danh sách mã giảm giá"
                    // secondary={
                    //     <div className="d-flex align-items-center gap-2">
                    //         <button className="btn btn-primary">+ Thêm mới</button>
                    //         <button className="btn btn-outline-secondary">Xuất file</button>
                    //     </div>
                    // }
                >
                    <Table responsive hover className="mb-0">
                        <thead className="table-secondary">
                            <tr>
                                <th>STT</th>
                                <th>Mã</th>
                                <th>Tên mã giảm giá</th>
                                <th>Ngày hiệu lực</th>
                                <th>Ngày hết hiệu lực</th>
                                <th>Giá trị giảm (%)</th>
                                <th>Dịch vụ áp dụng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </MainCard>
            </Col>
        </Row>
    );
}
