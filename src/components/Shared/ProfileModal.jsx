import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../https/Index";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { enqueueSnackbar } from "notistack";
import { IoClose, IoPerson, IoLockClosed, IoCamera } from "react-icons/io5";

const ProfileModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user || {});

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");

  const profileMutation = useMutation({
    mutationFn: (formData) => updateUserProfile(formData),
    onSuccess: (res) => {
      const updated = res?.data?.user || res?.data || null;
      if (updated && Object.keys(updated).length > 0) {
        dispatch(
          setUser({
            _id: updated.id || user._id,
            name: updated.name || name,
            email: updated.email || user.email,
            phone: updated.phone || phone,
            isAdmin: updated.is_admin || user.isAdmin,
            isSuperuser: updated.is_superadmin || user.isSuperuser,
            avatar: updated.avatar || updated.profile_image || updated.profileImage || user.avatar,
          })
        );
      }

      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      onClose();
    },
    onError: (err) => {
      console.error("Profile update failed", err);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload) => updateUserProfile(payload),
    onSuccess: (res) => {
      enqueueSnackbar("Password changed successfully", { variant: "success" });
      setOldPassword("");
      setNewPassword("");
    },
    onError: (err) => {
      console.error("Password change failed", err);
      enqueueSnackbar("Failed to change password", { variant: "error" });
    },
  });

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('phone', phone);
    if (avatarFile) fd.append('avatar', avatarFile);
    profileMutation.mutate(fd);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return enqueueSnackbar('New password required', { variant: 'warning' });
    const payload = { old_password: oldPassword, password: newPassword };
    passwordMutation.mutate(payload);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const resetForm = () => {
    setName(user.name || "");
    setPhone(user.phone || "");
    setAvatarFile(null);
    setAvatarPreview(user.avatar || "");
    setOldPassword("");
    setNewPassword("");
  };

  if (!open) return null;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <IoPerson className="header-icon" />
            <h3 className="modal-title">Edit Profile</h3>
          </div>
          <button onClick={onClose} className="close-button">
            <IoClose className="close-icon" />
          </button>
        </div>

        <div className="modal-content">
          {/* Profile Section */}
          <form onSubmit={handleSubmitProfile} className="profile-section">
            <div className="section-header">
              <h4 className="section-title">Personal Information</h4>
              <p className="section-subtitle">Update your personal details</p>
            </div>

            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile preview" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      <IoPerson className="placeholder-icon" />
                    </div>
                  )}
                </div>
                <label className="avatar-upload-button">
                  <IoCamera className="camera-icon" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="avatar-input"
                    disabled={profileMutation.isLoading}
                  />
                  Change Photo
                </label>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="form-input"
                  disabled={profileMutation.isLoading}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="form-input"
                  disabled={profileMutation.isLoading}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={profileMutation.isLoading}
                className="save-button primary"
              >
                {profileMutation.isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="save-button secondary"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Password Section */}
          <div className="password-section">
            <div className="section-divider"></div>
            
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="section-header">
                <IoLockClosed className="header-icon" />
                <h4 className="section-title">Change Password</h4>
              </div>
              <p className="section-subtitle">Update your password for security</p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={passwordMutation.isLoading}
                  className="save-button primary"
                >
                  {passwordMutation.isLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setOldPassword(""); setNewPassword(""); }}
                  className="save-button secondary"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .profile-modal-container {
          background: var(--card-bg);
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        /* Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          background: #f8f9ff;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-icon {
          color: var(--primary);
          font-size: 1.5rem;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .close-icon {
          font-size: 1.5rem;
        }

        /* Content */
        .modal-content {
          padding: 2rem;
        }

        /* Sections */
        .profile-section, .password-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .section-subtitle {
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          font-size: 0.875rem;
        }

        .section-divider {
          height: 1px;
          background: var(--border-color);
          margin: 2rem 0;
        }

        /* Avatar Section */
        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .avatar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-preview {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--border-color);
          background: #f8f9ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          color: white;
        }

        .placeholder-icon {
          font-size: 2.5rem;
        }

        .avatar-upload-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .avatar-upload-button:hover {
          border-color: var(--primary);
          background: #f8f9ff;
        }

        .avatar-input {
          display: none;
        }

        .camera-icon {
          font-size: 1rem;
        }

        /* Form Styles */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
        }

        .form-input {
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        /* Buttons */
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-button.primary {
          background: var(--primary);
          color: white;
        }

        .save-button.primary:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }

        .save-button.secondary {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
        }

        .save-button.secondary:hover {
          background: #f8f9ff;
          border-color: var(--primary);
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-modal-container {
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.25rem 1.5rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .save-button {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 1rem 1.25rem;
          }

          .modal-content {
            padding: 1.25rem;
          }

          .avatar-preview {
            width: 80px;
            height: 80px;
          }

          .placeholder-icon {
            font-size: 2rem;
          }
        }

        /* Custom scrollbar */
        .profile-modal-container::-webkit-scrollbar {
          width: 6px;
        }

        .profile-modal-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .profile-modal-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .profile-modal-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;