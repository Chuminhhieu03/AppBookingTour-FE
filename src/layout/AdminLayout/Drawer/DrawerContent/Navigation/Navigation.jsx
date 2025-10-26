import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import DrawerItems from '../../DrawerItems/DrawerItem';

export default function Navigation({ selectedItems, setSelectedItems, setSelectTab }) {
  const [selectedID, setSelectedID] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const lastItem = null;
  let lastItemIndex = DrawerItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < DrawerItems.items.length) {
    lastItemId = DrawerItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = DrawerItems.items.slice(lastItem - 1, DrawerItems.items.length).map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navGroups = DrawerItems.items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <>
              <ListGroup.Item key={index}>
                <NavItem item={item} level={1} isParents />
              </ListGroup.Item>
            </>
          );
        }
        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedID={selectedID}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
            setSelectTab={setSelectTab ?? (() => {})}
          />
        );
      case 'item':
        return (
          <ListGroup.Item key={index}>
            <NavItem item={item} level={1} />
          </ListGroup.Item>
        );
      default:
        return (
          <h6 key={item.id} color="error" className="align-items-center">
            Fix - Navigation Group
          </h6>
        );
    }
  });
  return <ul className={`pc-navbar 'd-block'`}>{navGroups}</ul>;
}
