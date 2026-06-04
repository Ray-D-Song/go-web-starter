import { Input, Textarea } from '@cloudflare/kumo/components/input'
import { Select } from '@cloudflare/kumo/components/select'
import { useTranslation } from 'react-i18next'
import { AppDialog } from '@/components/app-dialog'
import type { Project } from '@/services/projects'
import type { ProjectFormState } from './project-form'
import type { Dispatch, SetStateAction } from 'react'

interface ProjectDialogsProps {
  createModalOpen: boolean
  editingProject: Project | null
  deleteProject: Project | null
  formState: ProjectFormState
  setCreateModalOpen: (open: boolean) => void
  setEditingProject: (project: Project | null) => void
  setDeleteProject: (project: Project | null) => void
  setFormState: Dispatch<SetStateAction<ProjectFormState>>
  onCreate: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProjectDialogs({
  createModalOpen,
  editingProject,
  deleteProject,
  formState,
  setCreateModalOpen,
  setEditingProject,
  setDeleteProject,
  setFormState,
  onCreate,
  onEdit,
  onDelete,
}: ProjectDialogsProps) {
  const { t } = useTranslation()

  const projectForm = (
    <>
      <Input
        label={t('projects.form.name')}
        required
        maxLength={255}
        value={formState.name}
        placeholder={t('projects.form.namePlaceholder')}
        onChange={(event) => setFormState(prev => ({ ...prev, name: event.currentTarget.value }))}
      />
      <Textarea
        label={t('projects.form.description')}
        rows={3}
        value={formState.description}
        placeholder={t('projects.form.descriptionPlaceholder')}
        onChange={(event) => setFormState(prev => ({ ...prev, description: event.currentTarget.value }))}
      />
      {editingProject && (
        <Select
          label={t('projects.form.status')}
          value={String(formState.status ?? 1)}
          onValueChange={(value) => setFormState(prev => ({ ...prev, status: Number(value) }))}
        >
          <Select.Option value="1">{t('projects.status.enabled')}</Select.Option>
          <Select.Option value="0">{t('projects.status.disabled')}</Select.Option>
        </Select>
      )}
    </>
  )

  return (
    <>
      <AppDialog
        open={createModalOpen}
        title={t('projects.createProject')}
        confirmText={t('projects.createProject')}
        onOpenChange={setCreateModalOpen}
        onConfirm={() => {
          const form = document.getElementById('create-project-form') as HTMLFormElement | null
          form?.requestSubmit()
        }}
      >
        <form
          id="create-project-form"
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onCreate()
          }}
        >
          {projectForm}
        </form>
      </AppDialog>

      <AppDialog
        open={!!editingProject}
        title={t('projects.editProject')}
        confirmText={t('projects.editProject')}
        onOpenChange={(open) => !open && setEditingProject(null)}
        onConfirm={() => {
          const form = document.getElementById('edit-project-form') as HTMLFormElement | null
          form?.requestSubmit()
        }}
      >
        <form
          id="edit-project-form"
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onEdit()
          }}
        >
          {projectForm}
        </form>
      </AppDialog>

      <AppDialog
        open={!!deleteProject}
        role="alertdialog"
        title={t('projects.confirm.deleteTitle')}
        description={t('projects.confirm.deleteDescription')}
        confirmText={t('projects.actions.delete')}
        confirmVariant="destructive"
        onOpenChange={(open) => !open && setDeleteProject(null)}
        onConfirm={onDelete}
      />
    </>
  )
}
