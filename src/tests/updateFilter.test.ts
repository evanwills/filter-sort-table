import { getCtrlData, headConfigToInternal, updateFilter } from "../utilities/filter-sort.utils";
import { adminHeadConfig, formHeadConfig } from "../data/form-data";
import { IListCtrlOptionItem } from "../types/Igeneral";
// import { IFilterUpdateResult } from '../types/IFilterSortCtrl';
// import { IHeadConfigInternal } from "../types/header-config";


test( //  #1
  'updateFilter() test non-matched field update because the column name of the filter control doesn\'t match the field being updated',
  () => {
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData('id', 'filter', 2));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeFalsy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
    expect(oldCol).toEqual(newCol);
  }
);

test( //  #2
  'updateFilter() test "basic (text)" filter update',
  () => {
    const col = 'name';
    const change = 'filter';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 'dan'));
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.filter).toEqual('');

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    // expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    // expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.skip).toEqual(false);
    expect(newCol.filter).toEqual('dan');

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change, ''));
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.max).toEqual(0);
    expect(newData.item.skip).toEqual(true);
  }
);

test( //  #3
  'updateFilter() test "basic (number)" filter update',
  () => {
    const col = 'id';
    const change = 'filter';
    const oldCol = headConfigToInternal(formHeadConfig[0]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 2));
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.filter).toEqual(0);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    // expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    // expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.skip).toEqual(false);
    expect(newCol.filter).toEqual(2);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change, ''));
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.max).toEqual(0);
    expect(newData.item.skip).toEqual(true);
  }
);

test( //  #4
  'updateFilter() test "number (MIN/max)"  filter update',
  () => {
    const col = 'id';
    const change = 'min';
    const oldCol = headConfigToInternal(formHeadConfig[0]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 1));
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.min).toEqual(0);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    // expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    // expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.min).toEqual(1);
    expect(newCol.skip).toEqual(false);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change, 0));
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.max).toEqual(0);
    expect(newData.item.skip).toEqual(true);
  }
);

test( //  #5
  'updateFilter() test "number (min/MAX)"  filter update',
  () => {
    const col = 'id';
    const change = 'max';
    const oldCol = headConfigToInternal(formHeadConfig[0]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 3));
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.max).toEqual(0);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.min).toEqual(oldCol.min);
    // expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    // expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.max).toEqual(3);
    expect(newCol.skip).toEqual(false);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change, 0));
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.max).toEqual(0);
    expect(newData.item.skip).toEqual(true);
  }
);

test( //  #6
  'updateFilter() test "option" filter update',
  () => {
    const col = 'permissionLevel';
    const change = 'option';
    const oldOpt : Array<IListCtrlOptionItem> = [
      { id: 0, mode: 1 },
      { id: 1, mode: 1 },
      { id: 2, mode: 1 },
      { id: 3, mode: 0 },
      { id: 4, mode: 0 },
      { id: 5, mode: 0 }
    ];
    const newOpt : Array<IListCtrlOptionItem> = [
      { id: 0, mode: -1 },
      { id: 1, mode: 1 },
      { id: 2, mode: 1 },
      { id: 3, mode: 0 },
      { id: 4, mode: 0 },
      { id: 5, mode: 1 }
    ];
    const ctrl = getCtrlData(col, change);
    const oldCol = headConfigToInternal(adminHeadConfig[14]);
    const data = updateFilter(oldCol, { ...ctrl, options: newOpt });
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.max).toEqual(0);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.bool).toEqual(oldCol.bool);
    // expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    // expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.options).toEqual(newOpt);
    expect(newCol.skip).toEqual(false);

    // ------------------------------------------
    // Revert the last change and check the results

    const newCtrl =  getCtrlData(col, change);
    const newData = updateFilter(newCol, { ...newCtrl, options: oldOpt });
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.options).toEqual(oldCol.options);
    expect(newData.item.skip).toEqual(false);
  }
);

test( //  #7
  'updateFilter() test "filter on empty" filter update',
  () => {
    const col = 'name';
    const change = 'filter-on-empty';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change));
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.max).toEqual(0);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    // expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    // expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.filterOnEmpty).toEqual(true);
    expect(newCol.skip).toEqual(false);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change));
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.filterOnEmpty).toEqual(false);
    expect(newData.item.skip).toEqual(true);
  }
);

test( //  #8
  'updateFilter() test "is column (No toggle column)" filter update',
  () => {
    const col = 'name';
    const change = 'is-column';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(oldCol).toEqual(newCol);

    expect(data.hasChanged).toBeFalsy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
  }
);

test( //  #9
  'updateFilter() test "is column (allow toggle column)" filter update',
  () => {
    const col = 'name';
    const change = 'is-column';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change), true);
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.isColumn).toEqual(true);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    // expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.isColumn).toEqual(false);
    // expect(newCol.skip).toEqual(true);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change), true);

    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.isColumn).toEqual(true);
    // expect(newData.item.skip).toEqual(true);
  }
);

test( // #10
  'updateFilter() test "in export" filter update',
  () => {
    const col = 'name';
    const change = 'in-export';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change), true);
    const newCol = data.item;

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.isColumn).toEqual(true);

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.orderPriority).toEqual(oldCol.orderPriority);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);
    expect(newCol.filterOnEmpty).toEqual(oldCol.filterOnEmpty);
    // expect(newCol.inExport).toEqual(oldCol.inExport);
    expect(newCol.exportOrder).toEqual(oldCol.exportOrder);
    expect(newCol.skip).toEqual(oldCol.skip);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.inExport).toEqual(false);
    // expect(newCol.skip).toEqual(true);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change), true);

    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.inExport).toEqual(true);
    // expect(newData.item.skip).toEqual(true);
  }
);

test( // #11
  'updateFilter() test "move column (No move column)" filter update',
  () => {
    const col = 'name';
    const change = 'move-column';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 'up'));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(oldCol).toEqual(newCol);

    expect(data.hasChanged).toBeFalsy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
  }
);

test( // #12
  'updateFilter() test "move column (allow move column)" filter update',
  () => {
    const col = 'name';
    const change = 'move-column';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 'up'), true, true);
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(oldCol).toEqual(newCol);

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeTruthy();
  }
);

test( // #13
  'updateFilter() test "move export" filter update',
  () => {
    const col = 'name';
    const change = 'move-export';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 'up'), true, true);
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(oldCol).toEqual(newCol);

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeTruthy();
    expect(data.moveCol).toBeFalsy();
  }
);
