import { setSortOrder } from "../utilities/filter-sort-logic.utils";
import { formHeadConfig } from "../data/form-data";

test(
  'setSortOrder() set one column to decending',
  () => {
    const oldGroup = formHeadConfig[2];
    const updated = setSortOrder(formHeadConfig, 'group', 1);
    const newGroup = updated[2];

    expect(setSortOrder(formHeadConfig, 'group', 1)).not.toEqual(formHeadConfig);
    expect(newGroup).not.toEqual(oldGroup);
    expect(newGroup.order).toEqual(1);
    expect(newGroup.orderPriority).toEqual(0);
  }
);

test(
  'setSortOrder() set two columns to decending',
  () => {
    const oldGroup = formHeadConfig[2];
    const oldName = formHeadConfig[1];
    const updated = setSortOrder(
      setSortOrder(formHeadConfig, 'name', 1),
      'group',
      1
    );
    const newGroup = updated[2];
    const newName = updated[1];

    expect(setSortOrder(formHeadConfig, 'group', 1)).not.toEqual(formHeadConfig);

    expect(newGroup).not.toEqual(oldGroup);
    expect(newGroup.order).toEqual(1);
    expect(newGroup.orderPriority).toEqual(1);

    expect(newName).not.toEqual(oldName);
    expect(newName.order).toEqual(1);
    expect(newName.orderPriority).toEqual(0);
  }
);

test(
  'setSortOrder() set sort state for three columns',
  () => {
    const oldGroup = formHeadConfig[2];
    const oldName = formHeadConfig[1];
    const oldStatus = formHeadConfig[4];

    const updated = setSortOrder(
      setSortOrder(
        setSortOrder(formHeadConfig, 'status', -1),
        'name',
        1
      ),
      'group',
      1
    );
    const newGroup = updated[2];
    const newName = updated[1];
    const newStatus = updated[4];

    expect(newGroup).not.toEqual(oldGroup);
    expect(newGroup.order).toEqual(1);
    expect(newGroup.orderPriority).toEqual(2);

    expect(newName).not.toEqual(oldName);
    expect(newName.order).toEqual(1);
    expect(newName.orderPriority).toEqual(1);

    expect(newStatus).not.toEqual(oldStatus);
    expect(newStatus.order).toEqual(-1);
    expect(newStatus.orderPriority).toEqual(0);
  }
);

test(
  'setSortOrder() set sort state for three columns then revert the sort order for the second',
  () => {
    const oldGroup = formHeadConfig[2];
    const oldName = formHeadConfig[1];
    const oldStatus = formHeadConfig[4];

    const updated = setSortOrder(
      setSortOrder(
        setSortOrder(formHeadConfig, 'status', -1),
        'name',
        1
      ),
      'group',
      1
    );
    const newGroup = updated[2];
    const newName = updated[1];
    const newStatus = updated[4];

    expect(newGroup).not.toEqual(oldGroup);
    expect(newGroup.order).toEqual(1);
    // Group was set last so should have the highest value
    expect(newGroup.orderPriority).toEqual(2);

    expect(newName).not.toEqual(oldName);
    expect(newName.order).toEqual(1);
    // Name was set in the middle so should have a middle value
    expect(newName.orderPriority).toEqual(1);

    expect(newStatus).not.toEqual(oldStatus);
    expect(newStatus.order).toEqual(-1);
    // Status was set last so should have the lowest value
    expect(newStatus.orderPriority).toEqual(0);

    // Reset Name sort order to ignore
    const updatedAgain = setSortOrder(updated, 'name', 0);
    const newNewGroup = updatedAgain[2];
    const newNewName = updatedAgain[1];
    const newNewStatus = updatedAgain[4];

    expect(newNewGroup).not.toEqual(newGroup);
    expect(newNewGroup.order).toEqual(1);
    expect(newNewGroup.orderPriority).toEqual(1);

    // Should be back to being the same as intitial valie
    expect(newNewName).toEqual(oldName);
    expect(newNewName.order).toEqual(0);
    // Name was reset so should have negative value.
    expect(newNewName.orderPriority).toEqual(-1);

    // Because Status was set last it should not be effected by
    // the later change to Name
    expect(newNewStatus).toEqual(newStatus);
    expect(newNewStatus.order).toEqual(-1);
    expect(newNewStatus.orderPriority).toEqual(0);
  }
);
