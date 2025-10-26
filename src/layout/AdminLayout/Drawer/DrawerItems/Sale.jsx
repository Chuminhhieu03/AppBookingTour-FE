const sale = {
  id: 'sale',
  title: 'Khuyến mãi',
  type: 'group',
  children: [
    {
      id: 'discount',
      title: 'Mã giảm giá',
      type: 'item',
      icon: <i className="ph ph-seal-percent" />,
      url: '/admin/sale/discount'
    }
  ]
};

export default sale;
