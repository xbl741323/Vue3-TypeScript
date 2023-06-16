import dustbinEdited from '@/assets/img/dustbinEdited.gif'
import dustbinEditing from '@/assets/img/dustbinEditing.gif'
import dustbinpointEdited from '@/assets/img/dustbinpointEdited.png'
import dustbinpointEditing from '@/assets/img/dustbinpointEditing.png'
import shopEdited from '@/assets/img/shopEdited.png'
import shopEditing from '@/assets/img/shopEditing.png'
import transferstationEdited from '@/assets/img/transferstationEdited.png'
import transferstationEditing from '@/assets/img/transferstationEditing.png'
import institutionEdited from '@/assets/img/institutionEdited.png'
import institutionEditing from '@/assets/img/institutionEditing.png'
export const getWorktargetIcon = (worktargetTypeId, status) => {
  if (worktargetTypeId == 10) {
    if (status == 0) {
      return transferstationEditing
    } else {
      return transferstationEdited
    }
  } else if (worktargetTypeId == 21) {
    if (status == 0) {
      return dustbinpointEditing
    } else {
      return dustbinpointEdited
    }
  } else if (worktargetTypeId == 18) {
    if (status == 0) {
      return dustbinEditing
    } else {
      return dustbinEdited
    }
  } else if (worktargetTypeId == 37) {
    if (status == 0) {
      return institutionEditing
    } else {
      return institutionEdited
    }
  } else if (worktargetTypeId == 38) {
    if (status == 0) {
      return shopEditing
    } else {
      return shopEdited
    }
  } else {
    if (status == 0) {
      return shopEditing
    } else {
      return shopEdited
    }
  }
}
