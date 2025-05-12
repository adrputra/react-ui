/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Alert,
  Snackbar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Iconify from '../components/iconify';
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import InputInvitationModal, { SendWhatsappModal } from '../components/InputInvitationModal';
import { MetadataContext } from '../hooks/MetadataContext';
import { SendRequest } from '../utils/Enigma'

const { REACT_APP_GET_INVITATION_LIST } = process.env;

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'level', label: 'Level', alignRight: false },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: 'Actions', alignRight: true },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function InvitationPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [errorMessage, setErrorMessage] = useState({});

  const [invitationData, setInvitationData] = useState();

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [isDelete, setIsDelete] = useState(false);

  const [rowData, setRowData] = useState(null)

  const [openModalWhatsapp, setOpenModalWhatsapp] = useState(false);

  const { metadata } = useContext(MetadataContext);

  const handleOpenMenu = (event, code) => {
    setOpen(event.currentTarget);
    setRowData(code);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = invitationData.map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, code) => {
    const selectedIndex = selected.indexOf(code);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, code);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invitationData.length) : 0;

  const handleOpenModal = (row) => {
    setOpenModal(true);
    setRowData(row)
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsDelete(false)
    setRowData(null)
    setOpenModalWhatsapp(false);
  };

  const handleOpenModalWhatsapp = (row) => {
    setOpenModalWhatsapp(true);
    setRowData(row);
  };

  const handleCloseModalWhatsapp = () => {
    setOpenModalWhatsapp(false);
    setRowData(null);
  };

  const handleErrorMessage = (error) => {
    setErrorMessage(error)
    setTimeout(() => {
      setErrorMessage({});
    }, 5000);
  }

  const req = {
    userId: metadata.userId,
  };

  const InquiryInvitationList = async () => {
    console.log('REQ Invitation List', req);
    try {
      const response = await SendRequest(REACT_APP_GET_INVITATION_LIST, req);

      console.log('RES Invitation List', response.data);

      if (response.data.code === 200) {
        setInvitationData(response.data.message.Result);
      } else {
        setErrorMessage({ msg: response.data.message.Description, code: 'error' });
        console.log(errorMessage);
      }
    } catch (error) {
      setErrorMessage({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.log(error);
    } finally {
      console.log('Invitation Data Length', invitationData ? invitationData.length : 0);
      setTimeout(() => {
        setErrorMessage({});
      }, 5000);
    }
  };

  useEffect(() => {
    InquiryInvitationList();
  }, []);

  useEffect(() => {
    if (invitationData) {
      const sortedFilteredUsers = applySortFilter(invitationData, getComparator(order, orderBy), filterName);
      setFilteredUsers(sortedFilteredUsers); // Store the filtered users in state
    }
  }, [invitationData, order, orderBy, filterName]);

  return (
    <>
      <Helmet>
        <title> User | Eventarry </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {Object.keys(errorMessage).length > 0 && (
            <Snackbar open autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert variant="filled" severity={errorMessage.code} sx={{ width: '100%' }}>
                {errorMessage.msg}
              </Alert>
            </Snackbar>
          )}
          <Typography variant="h4" gutterBottom>
            Invitation List
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleOpenModal(null)}>
            New Invitation
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={invitationData ? invitationData.length : 0}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers &&
                    filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { name, code, level, phoneNumber, status } = row;
                      const selectedUser = selected.indexOf(code) !== -1;
                      let statusColor;

                      switch (status) {
                        case 'Invited':
                          statusColor = 'warning';
                          break;
                        case 'Notified':
                          statusColor = 'info';
                          break;
                        case 'Attended':
                          statusColor = 'success';
                          break;

                        default:
                          statusColor = 'yellow';
                          break;
                      }

                      return (
                        <TableRow hover key={code} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, code)} />
                          </TableCell>

                          <TableCell align="left">{name}</TableCell>

                          <TableCell align="left">{code}</TableCell>

                          <TableCell align="left">{level}</TableCell>

                          <TableCell align="left">{phoneNumber}</TableCell>

                          <TableCell align="left">
                            <Label color={statusColor}>{status}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                          <Popover
                            open={Boolean(open)}
                            anchorEl={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                              sx: {
                                p: 1,
                                width: 200,
                                '& .MuiMenuItem-root': {
                                  px: 1,
                                  typography: 'body2',
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                handleOpenModal(rowData);
                                handleCloseMenu();
                              }}
                            >
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Edit
                            </MenuItem>

                            <MenuItem sx={{ color: 'success.main' }}
                              onClick={() => {
                                handleOpenModalWhatsapp(rowData);
                                handleCloseMenu();
                              }}
                            >
                              <Iconify icon={'bi:send-fill'} sx={{ mr: 2 }} />
                              Send Invitation
                            </MenuItem>

                            <MenuItem sx={{ color: 'error.main' }}
                              onClick={() => {
                                handleOpenModal(rowData);
                                setIsDelete(true)
                                handleCloseMenu();
                              }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Delete
                            </MenuItem>
                          </Popover>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                  {filteredUsers.length === 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6}>Data Not Found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={invitationData ? invitationData.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {openModal && (
          <InputInvitationModal
            open={openModal}
            isError={handleErrorMessage}
            onClose={handleCloseModal}
            InquiryInvitationList={InquiryInvitationList}
            initialData={rowData}
            isDelete={isDelete}
          />
        )}
        {openModalWhatsapp && (
          <SendWhatsappModal
            open={openModalWhatsapp}
            isError={handleErrorMessage}
            onClose={handleCloseModal}
            InquiryInvitationList={InquiryInvitationList}
            data={rowData}
          />
        )}
      </Container>
    </>
  );
}
