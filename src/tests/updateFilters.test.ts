import { getCtrlData, headConfigToInternal, updateFilter } from "../utilities/filter-sort.utils";
import { adminHeadConfig, formHeadConfig } from "../data/form-data";
// import { IFilterUpdateResult } from '../types/IFilterSortCtrl';
// import { IHeadConfigInternal } from "../types/header-config";


test(
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

test(
  'updateFilter() test basic filter (text) update',
  () => {
    const col = 'name';
    const change = 'filter';
    const oldCol = headConfigToInternal(formHeadConfig[1]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 'dan'));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected

    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.filter).toEqual('');

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);

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

test(
  'updateFilter() test basic filter (number) update',
  () => {
    const col = 'id';
    const change = 'filter';
    const oldCol = headConfigToInternal(formHeadConfig[0]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 2));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected
    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.filter).toEqual(0);

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.isColumn).toEqual(oldCol.isColumn );

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

test(
  'updateFilter() test number MIN/max filter update',
  () => {
    const col = 'id';
    const change = 'min';
    const oldCol = headConfigToInternal(formHeadConfig[0]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 1));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected
    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.min).toEqual(0);

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);

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

test(
  'updateFilter() test number min/MAX filter update',
  () => {
    const col = 'id';
    const change = 'max';
    const oldCol = headConfigToInternal(formHeadConfig[0]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 3));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected
    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.max).toEqual(0);

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.bool).toEqual(oldCol.bool);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);

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

test(
  'updateFilter() test boolean filter update',
  () => {
    const col = 'isForbidden';
    const change = 'bool';
    const oldCol = headConfigToInternal(adminHeadConfig[5]);
    const data = updateFilter(oldCol, getCtrlData(col, change, 1));
    const newCol = data.item;

    // ------------------------------------------
    // Check basic results of update

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();

    // ------------------------------------------
    // This is just to verify the starting data matches what's
    // expected
    expect(oldCol).not.toEqual(newCol);
    expect(oldCol.skip).toEqual(true);
    expect(oldCol.max).toEqual(0);

    // ------------------------------------------
    // Make sure everything that shouldn't have changed is still
    // the same

    expect(newCol.filter).toEqual(oldCol.filter);
    expect(newCol.order).toEqual(oldCol.order);
    expect(newCol.max).toEqual(oldCol.max);
    expect(newCol.min).toEqual(oldCol.min);
    expect(newCol.options).toEqual(oldCol.options);
    expect(newCol.isColumn).toEqual(oldCol.isColumn);
    expect(newCol.colOrder).toEqual(oldCol.colOrder);

    // ------------------------------------------
    // Make sure the things that should have changed are actually
    // changed

    expect(newCol.bool).toEqual(1);
    expect(newCol.skip).toEqual(false);

    // ------------------------------------------
    // Revert the last change and check the results

    const newData = updateFilter(newCol, getCtrlData(col, change, 0));
    expect(newData.hasChanged).toBeTruthy();
    expect(newData.item.bool).toEqual(0);
    expect(newData.item.skip).toEqual(true);
  }
);
