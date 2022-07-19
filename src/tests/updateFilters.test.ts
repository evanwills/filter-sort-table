import { getDummyCtrl, headConfigToInternal, updateFilter } from "../utilities/filter-sort.utils";
import { formHeadConfig } from "../data/form-data";
import { IFilterSortCtrlData, IFilterUpdateResult } from '../types/IFilterSortCtrl';
import { IHeadConfigInternal } from "../types/header-config";


test(
  'updateFilter() test non-matched field update because the column name of the filter control doesn\'t match the field being updated',
  () => {
    const ctrl : IFilterSortCtrlData = getDummyCtrl('id', 'filter', 2);
    const oldName : IHeadConfigInternal = headConfigToInternal(formHeadConfig[1]);
    const data : IFilterUpdateResult = updateFilter(oldName, ctrl, false);
    const newName : IHeadConfigInternal = data.item


    expect(data.hasChanged).toBeFalsy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
    expect(oldName).toEqual(newName);
  }
);

test(
  'updateFilter() test basic filter (text) update',
  () => {
    const ctrl : IFilterSortCtrlData = getDummyCtrl('name', 'filter', 'dan');
    const oldName : IHeadConfigInternal = headConfigToInternal(formHeadConfig[1]);
    const data : IFilterUpdateResult = updateFilter(oldName, ctrl, false);
    const newName : IHeadConfigInternal = data.item

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
    expect(oldName).not.toEqual(newName);
    // expect(oldName.skip).toEqual(true);
    expect(oldName.filter).toEqual('');
    expect(newName.order).toEqual(oldName.order);
    expect(newName.min).toEqual(oldName.min);
    expect(newName.max).toEqual(oldName.max);
    expect(newName.bool).toEqual(oldName.bool);
    expect(newName.options).toEqual(oldName.options);
    expect(newName.isColumn).toEqual(oldName.isColumn);
    expect(newName.skip).toEqual(false);
    expect(newName.filter).toEqual('dan');
  }
);

test(
  'updateFilter() test basic filter (number) update',
  () => {
    const ctrl : IFilterSortCtrlData = getDummyCtrl('id', 'filter', 2);
    const oldName : IHeadConfigInternal = headConfigToInternal(formHeadConfig[0]);
    const data : IFilterUpdateResult = updateFilter(oldName, ctrl, false);
    const newName : IHeadConfigInternal = data.item

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
    expect(oldName).not.toEqual(newName);
    // expect(oldName.skip).toEqual(true);
    expect(oldName.filter).toEqual(0);
    expect(newName.order).toEqual(oldName.order);
    expect(newName.min).toEqual(oldName.min);
    expect(newName.max).toEqual(oldName.max);
    expect(newName.bool).toEqual(oldName.bool);
    expect(newName.options).toEqual(oldName.options);
    expect(newName.isColumn).toEqual(oldName.isColumn );
    expect(newName.skip).toEqual(false);
    expect(newName.filter).toEqual(2);
  }
);

test(
  'updateFilter() test number MIN/max filter update',
  () => {
    const ctrl : IFilterSortCtrlData = getDummyCtrl('id', 'filter', 2);
    const oldName : IHeadConfigInternal = headConfigToInternal(formHeadConfig[0]);
    const data : IFilterUpdateResult = updateFilter(
      oldName,
      { ...ctrl, changed: 'min', min: 1 },
      false
    );
    const newName : IHeadConfigInternal = data.item

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
    expect(oldName).not.toEqual(newName);
    // expect(oldName.skip).toEqual(true);
    expect(oldName.min).toEqual(0);
    expect(newName.filter).toEqual(oldName.filter);
    expect(newName.order).toEqual(oldName.order);
    expect(newName.min).toEqual(1);
    expect(newName.max).toEqual(oldName.max);
    expect(newName.bool).toEqual(oldName.bool);
    expect(newName.options).toEqual(oldName.options);
    expect(newName.isColumn).toEqual(oldName.isColumn );
    expect(newName.skip).toEqual(false);
  }
);

test(
  'updateFilter() test number min/MAX filter update',
  () => {
    const ctrl : IFilterSortCtrlData = getDummyCtrl('id', 'filter', 2);
    const oldName : IHeadConfigInternal = headConfigToInternal(formHeadConfig[0]);
    const data : IFilterUpdateResult = updateFilter(
      oldName,
      { ...ctrl, changed: 'max', max: 3 },
      false
    );
    const newName : IHeadConfigInternal = data.item

    expect(data.hasChanged).toBeTruthy();
    expect(data.resetOrder).toBeFalsy();
    expect(data.moveExport).toBeFalsy();
    expect(data.moveCol).toBeFalsy();
    expect(oldName).not.toEqual(newName);
    // expect(oldName.skip).toEqual(true);
    expect(oldName.max).toEqual(0);
    expect(newName.filter).toEqual(oldName.filter);
    expect(newName.order).toEqual(oldName.order);
    expect(newName.max).toEqual(3);
    expect(newName.min).toEqual(oldName.min);
    expect(newName.bool).toEqual(oldName.bool);
    expect(newName.options).toEqual(oldName.options);
    expect(newName.isColumn).toEqual(oldName.isColumn);
    expect(newName.colOrder).toEqual(oldName.colOrder);
    expect(newName.skip).toEqual(false);
  }
);
