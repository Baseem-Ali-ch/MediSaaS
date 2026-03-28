import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';

export interface BranchData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: 'Active' | 'Inactive';
  isMain: boolean;
}

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatSelectModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent implements OnInit {

  branches: BranchData[] = [
    {
      id: 'B001',
      name: 'MediSaaS Central Headquarters',
      email: 'hq@medisaas.com',
      phone: '+1 (555) 123-4567',
      address: '123 Medical Drive, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      status: 'Active',
      isMain: true
    },
    {
      id: 'B002',
      name: 'Downtown Clinical Lab',
      email: 'downtown@medisaas.com',
      phone: '+1 (555) 987-6543',
      address: '750 Market Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      status: 'Active',
      isMain: false
    },
    {
      id: 'B003',
      name: 'East Bay Diagnostics',
      email: 'eastbay@medisaas.com',
      phone: '+1 (555) 456-7890',
      address: '400 Broadway',
      city: 'Oakland',
      state: 'CA',
      country: 'United States',
      status: 'Inactive',
      isMain: false
    }
  ];

  searchQuery: string = '';
  filterStatus: 'All' | 'Active' | 'Inactive' = 'All';

  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;

  toastMessage = '';
  toastIsError = false;

  branchModel: BranchData = this.getEmptyModel();
  originalModel: BranchData = this.getEmptyModel();

  focus: Record<string, boolean> = {};

  allCountries: string[] = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua & Deps','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Rep','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czechia','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland {Republic}','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea North','Korea South','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russian Federation','Rwanda','Samoa','San Marino','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'];
  statesMap: Record<string, string[]> = {
    'United States': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
    'Canada': ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan'],
    'United Kingdom': ['England','Scotland','Wales','Northern Ireland'],
    'India': ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'],
    'Australia': ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania']
  };

  countrySearch: string = '';
  stateSearch: string = '';

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

  getFilteredCountries(): string[] {
    if (!this.countrySearch) return this.allCountries;
    return this.allCountries.filter(c => c.toLowerCase().includes(this.countrySearch.toLowerCase()));
  }

  getFilteredStates(): string[] {
    const states = this.statesMap[this.branchModel.country] || [];
    if (!this.stateSearch) return states;
    return states.filter(s => s.toLowerCase().includes(this.stateSearch.toLowerCase()));
  }

  onCountryChange() {
    this.branchModel.state = ''; // reset state when country changes
  }

  filteredBranches(): BranchData[] {
    let result = this.branches;

    if (this.filterStatus !== 'All') {
      result = result.filter(b => b.status === this.filterStatus);
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q)
      );
    }
    return result;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'All';
  }

  getEmptyModel(): BranchData {
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      status: 'Active',
      isMain: false
    };
  }

  openAddPanel() {
    this.editMode = false;
    this.branchModel = this.getEmptyModel();
    this.originalModel = { ...this.branchModel };
    this.isPanelOpen = true;
  }

  openEditPanel(branch: BranchData) {
    this.editMode = true;
    this.branchModel = { ...branch };
    this.originalModel = { ...branch };
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  setFocus(field: string) { this.focus[field] = true; }
  clearFocus(field: string) { this.focus[field] = false; }

  hasChanges(): boolean {
    return JSON.stringify(this.branchModel) !== JSON.stringify(this.originalModel);
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  formValid(): boolean {
    return !!this.branchModel.name &&
      this.isValidEmail(this.branchModel.email) &&
      !!this.branchModel.phone &&
      !!this.branchModel.address &&
      !!this.branchModel.city &&
      !!this.branchModel.country;
  }

  numericOnly(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  saveBranch() {
    if (!this.formValid()) return;
    this.isSubmitting = true;

    setTimeout(() => {
      if (this.editMode) {
        const idx = this.branches.findIndex(b => b.id === this.branchModel.id);
        if (idx !== -1) {
          this.branches[idx] = { ...this.branchModel };
          this.showToast('Branch updated successfully', false);
        }
      } else {
        const newBranch = { ...this.branchModel, id: 'B' + Math.floor(Math.random() * 10000) };
        this.branches.push(newBranch);
        this.showToast('Branch added successfully', false);
      }
      this.isSubmitting = false;
      this.closePanel();
    }, 800);
  }

  deleteBranch(branch: BranchData) {
    if (branch.isMain) return;

    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        title: 'Delete Branch',
        message: `Are you sure you want to delete <b>${branch.name}</b>?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Find element to trigger fading out animation conceptually (handled tracking in view usually by ngFor trackBy, simplistic here)
        this.branches = this.branches.filter(b => b.id !== branch.id);
        this.showToast('Branch deleted successfully', false);
      }
    });
  }

  showToast(msg: string, isError: boolean) {
    this.toastMessage = msg;
    this.toastIsError = isError;
    setTimeout(() => { this.toastMessage = ''; }, 3000);
  }
}
