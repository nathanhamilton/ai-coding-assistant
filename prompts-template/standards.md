# Coding Standards & Conventions

**Reference this file when implementing new features to maintain consistency.**

---

## 🤝 Collaboration Principle: Ask First

### Core Philosophy

**The AI assistant is a collaborator, not an automation tool.** Before implementing non-trivial changes, present your plan and get approval. This ensures:
- Developer stays in control
- Intent is correctly understood
- Better solutions emerge through discussion
- Learning happens through collaboration

### When to Ask Before Acting

**ALWAYS ask first:**
- Architectural decisions (services vs models, new patterns)
- File structure changes (new directories, moving files)
- Adding dependencies (gems, packages)
- Breaking changes (API changes, schema modifications)
- Security-sensitive code (auth, authorization, data access)
- Multiple valid approaches (present options)

**Proceed without asking:**
- Obvious bug fixes (typos, simple logic errors)
- Explicitly requested actions ("add this method")
- Following established patterns (user showed you the pattern)
- Standard boilerplate (factories, basic tests)

### Implementation Approval Pattern

Present your plan, explain trade-offs, and ask for approval:

```markdown
I'll implement X using this approach:

**Plan:**
[Clear description of implementation]

**Trade-offs:**
- ✅ Benefits
- ⚠️ Considerations

**Files to create/modify:**
- [List of files]

Does this approach work for you, or would you like me to adjust?
```

For multiple approaches, present options with pros/cons and recommend one.

**See [project-init-guide.md](project-init-guide.md) for detailed examples and patterns.**

---

## 🎨 Code Style

### Ruby Style Guide
Follow [Ruby Style Guide](https://rubystyle.guide/) with these project-specific conventions:

#### String Literals
```ruby
# Prefer double quotes for strings
message = "Hello, #{student.name}"

# Use single quotes for non-interpolated strings
status = 'active'
```

#### Method Definitions
```ruby
# Good: Use explicit return only when needed
def full_name
  "#{first_name} #{last_name}"
end

# Good: Use guard clauses
def process_payment
  return unless payment_valid?
  return if already_processed?
  
  # Main logic
end

# Bad: Deep nesting
def process_payment
  if payment_valid?
    if !already_processed?
      # Main logic
    end
  end
end
```

#### Line Length
- **Soft limit**: 120 characters
- **Hard limit**: 140 characters
- Break long method chains meaningfully

```ruby
# Good: Meaningful breaks
User.active
       .with_memberships
       .where(created_year: 2025)
       .order(last_name: :asc)

# Bad: Random breaks just to fit line limit
User.active.with_memberships.where(
  created_year: 2025).order(last_name: :asc)
```

---

## 🏗️ Rails Conventions

### Model Organization

```ruby
class Student < ApplicationRecord
  # 1. Constants
  STATUSES = %w[active inactive suspended graduated].freeze
  
  # 2. Concerns/Modules
  include Searchable
  
  # 3. Attributes (attr_accessor, attr_reader, etc.)
  attr_accessor :skip_validations
  
  # 4. Associations
  belongs_to :coach, optional: true
  has_many :enrollments, dependent: :destroy
  has_many :courses, through: :enrollments
  
  # 5. Validations
  validates :email, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true
  validate :graduation_year_is_future, if: :active?
  
  # 6. Callbacks
  before_save :normalize_email
  after_create :send_welcome_email
  
  # 7. Scopes
  scope :active, -> { where(status: 'active') }
  scope :graduating_soon, -> { where('graduation_year <= ?', Date.current.year + 1) }
  
  # 8. Class methods
  def self.search_by_name(query)
    where("first_name ILIKE ? OR last_name ILIKE ?", "%#{query}%", "%#{query}%")
  end
  
  # 9. Instance methods (public)
  def full_name
    "#{first_name} #{last_name}"
  end
  
  def graduated?
    status == 'graduated'
  end
  
  # 10. Private methods
  private
  
  def normalize_email
    self.email = email.downcase.strip
  end
  
  def graduation_year_is_future
    errors.add(:graduation_year, 'must be in the future') if graduation_year < Date.current.year
  end
end
```

### Controller Organization

```ruby
class MembershipsController < ApplicationController
  # 1. Filters
  before_action :authenticate_user!
  before_action :set_membership, only: [:show, :edit, :update, :destroy]
  before_action :authorize_membership, only: [:edit, :update, :destroy]
  
  # 2. Actions (RESTful order: index, show, new, create, edit, update, destroy)
  def index
    @memberships = current_user.memberships.includes(:project)
  end
  
  def show
  end
  
  def new
    @membership = current_user.memberships.build
  end
  
  def create
    @membership = current_user.memberships.build(membership_params)
    
    if @enrollment.save
      redirect_to @enrollment, notice: 'Enrollment created successfully.'
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  # 3. Private methods
  private
  
  def set_enrollment
    @enrollment = Enrollment.find(params[:id])
  end
  
  def authorize_enrollment
    redirect_to root_path, alert: 'Not authorized' unless @enrollment.student == current_student
  end
  
  def enrollment_params
    params.require(:enrollment).permit(:course_id, :semester)
  end
end
```

### Service Objects

Use services for complex operations involving multiple models or external APIs.

```ruby
# app/services/enrollment_service.rb
class EnrollmentService
  class EnrollmentError < StandardError; end
  
  def initialize(student, course, options = {})
    @student = student
    @course = course
    @options = options
  end
  
  def call
    validate_enrollment!
    
    ActiveRecord::Base.transaction do
      enrollment = create_enrollment
      update_student_status
      notify_stakeholders
      enrollment
    end
  rescue StandardError => e
    Rails.logger.error "Enrollment failed: #{e.message}"
    raise EnrollmentError, e.message
  end
  
  private
  
  attr_reader :student, :course, :options
  
  def validate_enrollment!
    raise EnrollmentError, 'Course is full' if course.full?
    raise EnrollmentError, 'Student not eligible' unless student.eligible_for?(course)
  end
  
  def create_enrollment
    student.enrollments.create!(
      course: course,
      semester: options[:semester] || current_semester
    )
  end
  
  def update_student_status
    student.update!(status: 'enrolled') if student.pending?
  end
  
  def notify_stakeholders
    StudentMailer.enrollment_confirmation(student, course).deliver_later
    CoachMailer.new_enrollment(student.coach, student, course).deliver_later if student.coach
  end
  
  def current_semester
    # Logic to determine current semester
  end
end

# Usage in controller
def create
  service = EnrollmentService.new(current_student, course, enrollment_params)
  @enrollment = service.call
  
  redirect_to @enrollment, notice: 'Successfully enrolled!'
rescue EnrollmentService::EnrollmentError => e
  flash.now[:alert] = e.message
  render :new, status: :unprocessable_entity
end
```

### Query Objects

Use query objects for complex database queries.

```ruby
# app/query-objects/students_query.rb
class StudentsQuery
  def initialize(relation = Student.all)
    @relation = relation
  end
  
  def active
    @relation.where(status: 'active')
  end
  
  def with_coach
    @relation.where.not(coach_id: nil)
  end
  
  def graduating_in(year)
    @relation.where(graduation_year: year)
  end
  
  def search(query)
    return @relation if query.blank?
    
    @relation.where(
      "first_name ILIKE :q OR last_name ILIKE :q OR email ILIKE :q",
      q: "%#{query}%"
    )
  end
  
  def call
    @relation
  end
end

# Usage
students = StudentsQuery.new
                        .active
                        .with_coach
                        .graduating_in(2025)
                        .search(params[:query])
                        .call
```

### View Objects / Presenters

Keep presentation logic out of views and controllers.

```ruby
# app/view_objects/dashboard_presenter.rb
class DashboardPresenter
  def initialize(student)
    @student = student
  end
  
  def welcome_message
    "Welcome back, #{student.first_name}!"
  end
  
  def progress_percentage
    (completed_courses.count.to_f / total_courses.count * 100).round(1)
  end
  
  def upcoming_deadlines
    student.enrollments
           .includes(:course)
           .where('due_date > ? AND due_date < ?', Date.current, 7.days.from_now)
           .order(:due_date)
  end
  
  def recent_activity
    # Complex logic to gather recent activity
  end
  
  private
  
  attr_reader :student
  
  def completed_courses
    @completed_courses ||= student.enrollments.completed
  end
  
  def total_courses
    @total_courses ||= student.enrollments
  end
end

# Usage in controller
def index
  @presenter = DashboardPresenter.new(current_student)
end

# Usage in view
<%= @presenter.welcome_message %>
<%= "#{@presenter.progress_percentage}% Complete" %>
```

---

## 🧪 Testing Standards

### RSpec Structure

```ruby
# spec/models/student_spec.rb
require 'rails_helper'

RSpec.describe Student, type: :model do
  # 1. Let statements
  let(:student) { create(:student) }
  let(:coach) { create(:coach) }
  
  # 2. Describe blocks for methods/features
  describe 'associations' do
    it { should belong_to(:coach).optional }
    it { should have_many(:enrollments).dependent(:destroy) }
  end
  
  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
  end
  
  describe '#full_name' do
    it 'returns first and last name combined' do
      student = build(:student, first_name: 'John', last_name: 'Doe')
      expect(student.full_name).to eq('John Doe')
    end
  end
  
  describe '#graduated?' do
    context 'when status is graduated' do
      let(:student) { create(:student, status: 'graduated') }
      
      it 'returns true' do
        expect(student.graduated?).to be true
      end
    end
    
    context 'when status is not graduated' do
      let(:student) { create(:student, status: 'active') }
      
      it 'returns false' do
        expect(student.graduated?).to be false
      end
    end
  end
end
```

### Factory Definitions

```ruby
# spec/factories/students.rb
FactoryBot.define do
  factory :student do
    sequence(:email) { |n| "student#{n}@example.com" }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    phone { Faker::PhoneNumber.phone_number }
    status { 'active' }
    graduation_year { Date.current.year + 2 }
    
    trait :graduated do
      status { 'graduated' }
      graduation_year { Date.current.year - 1 }
    end
    
    trait :with_coach do
      association :coach
    end
    
    trait :with_enrollments do
      after(:create) do |student|
        create_list(:enrollment, 3, student: student)
      end
    end
  end
end

# Usage
create(:student)
create(:student, :graduated)
create(:student, :with_coach, :with_enrollments)
```

### Controller Tests

```ruby
# spec/controllers/enrollments_controller_spec.rb
require 'rails_helper'

RSpec.describe EnrollmentsController, type: :controller do
  let(:student) { create(:student) }
  let(:course) { create(:course) }
  
  before { sign_in student }
  
  describe 'GET #index' do
    it 'returns success' do
      get :index
      expect(response).to be_successful
    end
    
    it 'assigns @enrollments' do
      enrollment = create(:enrollment, student: student)
      get :index
      expect(assigns(:enrollments)).to include(enrollment)
    end
  end
  
  describe 'POST #create' do
    context 'with valid params' do
      let(:valid_params) { { enrollment: { course_id: course.id, semester: 'Fall 2025' } } }
      
      it 'creates a new enrollment' do
        expect {
          post :create, params: valid_params
        }.to change(Enrollment, :count).by(1)
      end
      
      it 'redirects to the enrollment' do
        post :create, params: valid_params
        expect(response).to redirect_to(Enrollment.last)
      end
    end
    
    context 'with invalid params' do
      let(:invalid_params) { { enrollment: { course_id: nil } } }
      
      it 'does not create enrollment' do
        expect {
          post :create, params: invalid_params
        }.not_to change(Enrollment, :count)
      end
      
      it 'renders new template' do
        post :create, params: invalid_params
        expect(response).to render_template(:new)
      end
    end
  end
end
```

### Feature Tests (Integration)

```ruby
# spec/features/student_enrollment_spec.rb
require 'rails_helper'

RSpec.describe 'Student Enrollment', type: :feature do
  let(:student) { create(:student) }
  let(:course) { create(:course, name: 'Introduction to Programming') }
  
  before do
    login_as(student, scope: :student)
  end
  
  scenario 'Student enrolls in a course' do
    visit courses_path
    click_link 'Introduction to Programming'
    click_button 'Enroll'
    
    expect(page).to have_content('Successfully enrolled')
    expect(page).to have_current_path(enrollment_path(Enrollment.last))
  end
  
  scenario 'Student cannot enroll in full course' do
    course.update!(capacity: 1, enrollments_count: 1)
    
    visit course_path(course)
    click_button 'Enroll'
    
    expect(page).to have_content('Course is full')
    expect(page).to have_current_path(course_path(course))
  end
end
```

---

## 🔐 Security Best Practices

### Strong Parameters
Always use strong parameters in controllers.

```ruby
def enrollment_params
  params.require(:enrollment).permit(:course_id, :semester, :notes)
end
```

### Authorization
Check authorization before sensitive actions.

```ruby
before_action :authorize_enrollment, only: [:edit, :update, :destroy]

private

def authorize_enrollment
  unless @enrollment.student == current_student || current_user.admin?
    redirect_to root_path, alert: 'Not authorized'
  end
end
```

### SQL Injection Prevention
Use parameterized queries.

```ruby
# Good
Student.where("email = ?", params[:email])
Student.where(email: params[:email])

# Bad - SQL injection risk
Student.where("email = '#{params[:email]}'")
```

---

## 📝 Documentation Standards

### Method Documentation
Document complex methods with comments.

```ruby
# Calculates the student's GPA based on completed courses
# 
# @return [Float] GPA value between 0.0 and 4.0
# @return [nil] if no completed courses
def calculate_gpa
  return nil if completed_courses.empty?
  
  total_points = completed_courses.sum { |course| course.grade_points * course.credits }
  total_credits = completed_courses.sum(&:credits)
  
  (total_points / total_credits).round(2)
end
```

### README Updates
Update README.md when:
- Adding new environment variables
- Changing setup steps
- Adding new dependencies
- Modifying deployment process

---

## ⚡ Performance Guidelines

### Database Queries

```ruby
# Good: Eager loading
students = Student.includes(:enrollments, :coach).where(status: 'active')

# Bad: N+1 queries
students.each do |student|
  puts student.enrollments.count  # Triggers query for each student
end

# Good: Counter cache
class Student < ApplicationRecord
  has_many :enrollments, counter_cache: true
end

# Access cached count
student.enrollments_count  # No query
```

### Background Jobs
Use background jobs for:
- Sending emails
- External API calls
- Heavy computations
- Batch processing

```ruby
# Good: Async
StudentMailer.welcome_email(student).deliver_later

# Bad: Synchronous in request
StudentMailer.welcome_email(student).deliver_now
```

---

## 🚫 Common Anti-Patterns to Avoid

### Fat Controllers
```ruby
# Bad: Business logic in controller
def create
  @student = Student.new(student_params)
  @student.email = @student.email.downcase
  
  if @student.save
    # 20 lines of logic...
  end
end

# Good: Use service objects
def create
  result = StudentRegistrationService.new(student_params).call
  
  if result.success?
    redirect_to result.student
  else
    render :new
  end
end
```

### Callback Hell
```ruby
# Bad: Too many callbacks
class Student < ApplicationRecord
  after_create :send_welcome_email
  after_create :notify_coach
  after_create :create_initial_records
  after_create :update_statistics
  # ... 10 more callbacks
end

# Good: Use service object for orchestration
class StudentRegistrationService
  def call
    student = Student.create!(student_params)
    send_welcome_email(student)
    notify_coach(student)
    # Explicit and testable
  end
end
```

---

**Last Updated**: 2025-12-04  
**Maintainer**: Development Team

_These standards should evolve with the project. Update when new patterns emerge or old ones prove problematic._
